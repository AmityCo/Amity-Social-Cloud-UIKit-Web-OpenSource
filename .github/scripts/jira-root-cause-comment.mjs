#!/usr/bin/env node
// Posts the root cause + build info of a merged PR as a comment on its Jira ticket(s).
//
// Run by .github/workflows/jira_root_cause_comment.yaml after the "Staging release pipeline"
// has deployed the merge commit to Staging. Can also be run locally:
//
//   GITHUB_REPOSITORY=AmityCo/Amity-Social-Cloud-UIKit-Web GITHUB_TOKEN=$(gh auth token) \
//   PR_NUMBER=1983 DRY_RUN=1 node .github/scripts/jira-root-cause-comment.mjs
//
// Env:
//   GITHUB_REPOSITORY, GITHUB_TOKEN   required
//   HEAD_SHA | PR_NUMBER              one of them: the develop commit the staging run deployed, or a PR
//   JIRA_BASE_URL, JIRA_USER, JIRA_API_TOKEN   required unless DRY_RUN=1
//   DRY_RUN=1                         print the comment, call nothing on Jira
//   STAGING_RUN_URL                   optional link to the staging run that deployed the commit
//
// The comment is built from these PR-description sections (see .github/pull_request_template.md).
// Both heading styles work: "**Root Cause :**" (this repo's template) and "### Root Cause".
//   Root Cause    required. Older PRs: a "- Root cause: …" bullet under Description also counts.
//   Solution      falls back to Description (minus the root cause bullet)
// Ticket keys come from the PR title (PDT-0000 is a placeholder and is ignored).
// A ticket that already has a comment linking this PR is skipped, so re-runs are safe.

const PACKAGE = '@amityco/ui-kit';
const SDK_PACKAGE = '@amityco/ts-sdk';
const STAGING_URL = 'https://uikit.staging.amity.co/';

const env = process.env;
const DRY_RUN = env.DRY_RUN === '1' || env.DRY_RUN === 'true';

const notice = (msg) => console.log(`::notice::${msg}`);
const warn = (msg) => console.log(`::warning::${msg}`);
const fail = (msg) => {
  console.log(`::error::${msg}`);
  process.exit(1);
};

// ── GitHub ──────────────────────────────────────────────────────────────────

async function gh(path, { optional = false } = {}) {
  const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}${path}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!res.ok) {
    if (optional) return null;
    fail(`GitHub ${path} → HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function findPr() {
  if (env.PR_NUMBER) return gh(`/pulls/${env.PR_NUMBER}`);
  if (!env.HEAD_SHA) fail('Set HEAD_SHA or PR_NUMBER');
  const prs = await gh(`/commits/${env.HEAD_SHA}/pulls`);
  return (
    prs.find((p) => p.merged_at && p.merge_commit_sha === env.HEAD_SHA) ??
    prs.find((p) => p.merged_at) ??
    null
  );
}

// package.json at the merge commit: the UIKit version line and the ts-sdk it builds with.
async function readPackageJson(sha) {
  const file = await gh(`/contents/package.json?ref=${sha}`, { optional: true });
  if (!file?.content) return null;
  try {
    return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

// ── PR description → sections ───────────────────────────────────────────────

// "### Root Cause" or a whole-line bold heading like "**Root Cause :**" / "**Root Cause:**".
const HEADING = [/^#{2,3}\s+(.+?)\s*$/, /^\*\*([^*]+?)\s*:?\s*\*\*\s*:?\s*$/];
// Lines that belong to the PR footer, not to the last section.
const FOOTER = [/^\*\*Jira\*\*\s*:/i, /^🤖 Generated with/, /^\[[^\]]+\]:\s*\S+/];
const ROOT_CAUSE_BULLET = /^\s*[-*+]\s+\**root cause[^:]*:\**\s*/i;

export function parseSections(body) {
  const text = (body ?? '').replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\n');
  const sections = {};
  let current = null;
  for (const line of text.split('\n')) {
    const h = HEADING.map((re) => line.trim().match(re)).find(Boolean);
    if (h) {
      current = h[1].trim().toLowerCase();
      sections[current] = [];
    } else if (current && !FOOTER.some((re) => re.test(line.trim()))) {
      sections[current].push(line);
    }
  }
  const out = {};
  for (const [k, lines] of Object.entries(sections)) out[k] = lines.join('\n').trim();
  return out;
}

function pick(sections, ...prefixes) {
  for (const p of prefixes) {
    const key = Object.keys(sections).find((k) => k.startsWith(p));
    if (key && sections[key]) return sections[key];
  }
  return '';
}

// Root Cause / Solution, with the older "- Root cause: …" bullet under Description as fallback.
export function rootCauseAndSolution(sections) {
  const description = pick(sections, 'description', 'short description');
  let rootCause = pick(sections, 'root cause');
  let solution = pick(sections, 'solution');
  if (!rootCause && description) {
    const lines = description.split('\n');
    const i = lines.findIndex((l) => ROOT_CAUSE_BULLET.test(l));
    if (i >= 0) {
      // the bullet plus any indented continuation lines
      let j = i + 1;
      while (j < lines.length && /^\s{2,}\S/.test(lines[j]) && !/^\s*[-*+]\s/.test(lines[j])) j++;
      rootCause = [lines[i].replace(ROOT_CAUSE_BULLET, ''), ...lines.slice(i + 1, j)]
        .join('\n')
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
      if (!solution) {
        solution = [...lines.slice(0, i), ...lines.slice(j)]
          .join('\n')
          .replace(/^(\s*[-*+]\s+)\**(change|fix|solution)s?\**\s*:\**\s*/gim, '$1')
          .trim();
      }
    }
  }
  return { rootCause, solution: solution || description };
}

// ── Markdown → Jira wiki markup (the subset PR descriptions use) ────────────

export function toWiki(md) {
  const codes = [];
  const keep = (s) => `\u0000${codes.push(s) - 1}\u0000`;
  let s = md
    .replace(/```[a-z]*\n([\s\S]*?)```/g, (_, c) => keep(`{code}\n${c}{code}`))
    .replace(/`([^`\n]+)`/g, (_, c) => keep(`{{${c}}}`));
  s = s
    .split('\n')
    .map((line) => {
      const bullet = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (bullet) return `${'*'.repeat(Math.floor(bullet[1].length / 2) + 1)} ${bullet[2]}`;
      const num = line.match(/^(\s*)\d+[.)]\s+(.*)$/);
      if (num) return `${'#'.repeat(Math.floor(num[1].length / 2) + 1)} ${num[2]}`;
      const head = line.match(/^(#{1,6})\s+(.*)$/);
      if (head) return `h${head[1].length}. ${head[2]}`;
      return line;
    })
    .join('\n')
    .replace(/\*\*(.+?)\*\*/g, '*$1*')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '[$1|$2]');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

// ── Comment ─────────────────────────────────────────────────────────────────

const strip = (v) => (typeof v === 'string' ? v.replace(/^[\^~]/, '') : null);

export function buildComment({ pr, sections, pkg }) {
  const sha = pr.merge_commit_sha ?? '';
  const merged = (pr.merged_at ?? '').slice(0, 10);
  const { rootCause, solution } = rootCauseAndSolution(sections);
  const sdk = strip(
    pkg?.dependencies?.[SDK_PACKAGE] ??
      pkg?.devDependencies?.[SDK_PACKAGE] ??
      pkg?.peerDependencies?.[SDK_PACKAGE],
  );
  const release = (pr.labels ?? [])
    .map((l) => l.name)
    .find((n) => n.startsWith('Release/'))
    ?.replace(/^Release\//, '');

  const build = [
    `* Environment: Staging — ${STAGING_URL}${
      env.STAGING_RUN_URL ? ` ([deploy run|${env.STAGING_RUN_URL}])` : ''
    }`,
    `* Build: {{develop@${sha.slice(0, 8)}}}${
      pkg?.version ? ` (on top of {{${PACKAGE}@${pkg.version}}})` : ''
    }`,
    ...(sdk ? [`* ts-sdk: {{${SDK_PACKAGE}@${sdk}}}`] : []),
    `* Ships in: ${release ? `${PACKAGE} release ${release}` : `the next ${PACKAGE} release`}`,
  ];

  return [
    '✅ *Fixed and merged to develop*',
    '',
    `*PR:* [#${pr.number}|${pr.html_url}] (merged ${merged})`,
    `*Branch:* {{${pr.head?.ref ?? ''}}}`,
    `*Merge commit:* {{${sha.slice(0, 8)}}}`,
    '',
    '*Root Cause:*',
    toWiki(rootCause),
    '',
    '*Solution:*',
    toWiki(solution || 'See the PR.'),
    '',
    '*Build version:*',
    ...build,
  ].join('\n');
}

// ── Jira ────────────────────────────────────────────────────────────────────

async function jira(path, init = {}) {
  const auth = Buffer.from(`${env.JIRA_USER}:${env.JIRA_API_TOKEN}`).toString('base64');
  return fetch(`${env.JIRA_BASE_URL.replace(/\/+$/, '')}/rest/api/2${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
}

async function alreadyCommented(key, prUrl) {
  const res = await jira(`/issue/${key}/comment?maxResults=100&orderBy=-created`);
  if (res.status === 404) return null; // ticket missing or not visible to the bot
  if (!res.ok) fail(`Jira GET ${key} comments → HTTP ${res.status}: ${await res.text()}`);
  const { comments = [] } = await res.json();
  return comments.some((c) => typeof c.body === 'string' && c.body.includes(prUrl));
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (!env.GITHUB_REPOSITORY || !env.GITHUB_TOKEN) fail('Set GITHUB_REPOSITORY and GITHUB_TOKEN');
  if (!DRY_RUN && !(env.JIRA_BASE_URL && env.JIRA_USER && env.JIRA_API_TOKEN)) {
    fail('Missing Jira secrets: JIRA_BASE_URL, JIRA_USER, JIRA_API_TOKEN');
  }

  const pr = await findPr();
  if (!pr) return notice(`No merged PR found for ${env.HEAD_SHA} — nothing to comment.`);
  if (!pr.merged_at) return notice(`PR #${pr.number} is not merged — skipping.`);

  const keys = [...new Set((pr.title.match(/PDT-\d+/g) ?? []).filter((k) => k !== 'PDT-0000'))];
  if (keys.length === 0) return notice(`PR #${pr.number} has no Jira key in its title — skipping.`);

  const sections = parseSections(pr.body);
  if (!rootCauseAndSolution(sections).rootCause) {
    return warn(
      `PR #${pr.number} (${keys.join(', ')}) has no "Root Cause" section — no Jira comment posted.`,
    );
  }

  const pkg = await readPackageJson(pr.merge_commit_sha);
  const body = buildComment({ pr, sections, pkg });
  console.log(`----- comment for ${keys.join(', ')} -----\n${body}\n-----`);
  if (DRY_RUN) return notice('DRY_RUN: nothing posted to Jira.');

  let failed = false;
  for (const key of keys) {
    const seen = await alreadyCommented(key, pr.html_url);
    if (seen === null) {
      warn(`${key}: not found or not visible to the Jira bot account — skipped.`);
      continue;
    }
    if (seen) {
      notice(`${key}: already has a comment for PR #${pr.number} — skipped.`);
      continue;
    }
    const res = await jira(`/issue/${key}/comment`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
    if (res.ok) {
      const { id } = await res.json();
      const base = env.JIRA_BASE_URL.replace(/\/+$/, '');
      notice(`${key}: root cause comment posted (${base}/browse/${key}?focusedCommentId=${id}).`);
    } else {
      console.log(`::error::${key}: Jira POST → HTTP ${res.status}: ${await res.text()}`);
      failed = true;
    }
  }
  if (failed) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
