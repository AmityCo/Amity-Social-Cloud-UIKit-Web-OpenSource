// SDK-integration gate. Enforces the rules in .claude/skills/sdk-integration/SKILL.md:
// every SDK read and write in src/v4/ goes through a hook in hooks/objects/,
// hooks/collections/ or hooks/queries/, named after its folder and exported from its barrel.
//
// Run:  node governance/gates/06-check-sdk-hooks.mjs              (whole tree)
//       node governance/gates/06-check-sdk-hooks.mjs <files...>   (only those files — lint-staged)
//       node governance/gates/06-check-sdk-hooks.mjs --json       (machine-readable)
// Exits 1 if any violation exists.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..', '..');
const at = (...p) => join(ROOT, ...p);
const rel = (p) => relative(ROOT, p);

const JSON_OUT = process.argv.includes('--json');
const ARG_FILES = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const SCOPE = ARG_FILES.length ? new Set(ARG_FILES.map((f) => rel(resolve(f)))) : null;
const inScope = (p) => SCOPE == null || SCOPE.has(rel(p));

const MODULES = ['core', 'social', 'chat'];
const KINDS = {
  objects: { suffix: 'Object', primitive: 'useLiveObjectV4' },
  collections: { suffix: 'Collection', primitive: 'useLiveCollectionV4' },
  queries: { suffix: 'Query', primitive: null },
};
const LIVE_PRIMITIVES = ['useLiveObjectV4', 'useLiveCollectionV4'];

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

// SAFE     — a local fix, contained to the hook file.
// ADVISORY — a rename that ripples to every call site; a human sequences it.
const SEVERITY = {
  'enabled-client': 'safe',
  'query-key-prefix': 'safe',
  'no-usecallback': 'safe',
  'primitive-folder': 'safe',
  barrel: 'safe',
  suffix: 'advisory',
  'plural-noun': 'advisory',
  'verb-naming': 'advisory',
  'pagination-naming': 'advisory',
  'primitive-escape': 'advisory',
};

const violations = [];
const add = (rule, file, actual, expected, fix) =>
  violations.push({
    rule,
    severity: SEVERITY[rule] ?? 'advisory',
    file: rel(file),
    actual,
    expected,
    fix,
  });

function walk(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(entry.name)) out.push(p);
  }
  return out;
}

// Every `return { … }` block in a file, brace-matched so nested objects stay intact.
function returnBlocks(src) {
  const out = [];
  const re = /return\s*\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0;
    let i = m.index + m[0].length - 1;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    out.push(src.slice(m.index, i + 1));
  }
  return out;
}

const keysIn = (block) =>
  [...block.matchAll(/(?:^|[{,])\s*([A-Za-z_$][\w$]*)\s*(?=[,:}])/g)].map((m) => m[1]);

// ── 1-6, 8-10: per-hook-file rules ────────────────────────────────────────────
const hookFiles = [];
for (const mod of MODULES) {
  for (const [kind, { suffix, primitive }] of Object.entries(KINDS)) {
    const folder = at('src', 'v4', mod, 'hooks', kind);
    if (!isDir(folder)) continue;

    const barrel = read(join(folder, 'index.ts')) ?? read(join(folder, 'index.tsx')) ?? '';

    for (const entry of readdirSync(folder)) {
      if (!/\.tsx?$/.test(entry) || entry.startsWith('index.')) continue;
      const file = join(folder, entry);
      hookFiles.push(file);
      if (!inScope(file)) continue;

      const name = entry.replace(/\.tsx?$/, '');
      const src = read(file) ?? '';
      const blocks = returnBlocks(src);
      const returned = new Set(blocks.flatMap(keysIn));

      // Rule: the primitive matches the folder it lives in.
      for (const [otherKind, other] of Object.entries(KINDS)) {
        if (otherKind === kind || !other.primitive) continue;
        if (new RegExp(`\\b${other.primitive}\\b`).test(src)) {
          add(
            'primitive-folder',
            file,
            `uses ${other.primitive} inside hooks/${kind}/`,
            `${other.primitive} belongs in hooks/${otherKind}/`,
            `move this hook to src/v4/${mod}/hooks/${otherKind}/, or switch it to ${primitive ?? 'useQuery/useMutation'}`,
          );
        }
      }
      if (kind !== 'queries' && /\buseMutation\b/.test(src)) {
        add(
          'primitive-folder',
          file,
          `uses useMutation inside hooks/${kind}/`,
          'useMutation belongs in hooks/queries/',
          `move this hook to src/v4/${mod}/hooks/queries/ and rename it to end in Query`,
        );
      }

      // Rule: the file name ends in the folder's suffix.
      if (!name.endsWith(suffix)) {
        add(
          'suffix',
          file,
          `${name} does not end in ${suffix}`,
          `hooks/${kind}/ hooks are named use<Noun>${suffix}`,
          `rename to ${name.replace(/(Object|Collection|Query)$/, '')}${suffix}`,
        );
      }

      // Rule: a collection's noun is plural.
      if (kind === 'collections' && name.endsWith(suffix)) {
        const noun = name.replace(/^use/, '').slice(0, -suffix.length);
        if (noun && !noun.endsWith('s')) {
          add(
            'plural-noun',
            file,
            `${name} names its noun in the singular`,
            'a collection returns many items — name the noun plural',
            `rename to use${noun}s${suffix}`,
          );
        }
      }

      // Rule: the hook is re-exported from its folder barrel.
      if (!new RegExp(`\\b${name}\\b`).test(barrel)) {
        add(
          'barrel',
          file,
          `${name} is not re-exported from hooks/${kind}/index.ts`,
          'consumers import from the folder, never the file',
          `add an export for ${name} to src/v4/${mod}/hooks/${kind}/index.ts`,
        );
      }

      // Rule: collections return hasMore / loadMore.
      if (kind === 'collections') {
        for (const wrong of ['hasNextPage', 'loadNextPage']) {
          if (returned.has(wrong)) {
            const right = wrong === 'hasNextPage' ? 'hasMore' : 'loadMore';
            add(
              'pagination-naming',
              file,
              `returns ${wrong}`,
              `collections return ${right}`,
              `rename the returned ${wrong} to ${right} and update its consumers`,
            );
          }
        }
      }

      if (kind === 'queries') {
        // Rule: enabled gates on the params, not on the client.
        for (const m of src.matchAll(/enabled:[^,}\n]*/g)) {
          if (/\bclient\b/.test(m[0])) {
            add(
              'enabled-client',
              file,
              m[0].trim(),
              'gate on the params the call needs',
              'AmityUIKitProvider guarantees a client before mount — drop the client check',
            );
          }
        }

        // Rule: queryKey starts with the UIKit namespace.
        for (const m of src.matchAll(/queryKey:\s*\[\s*(['"])([^'"]*)\1/g)) {
          if (m[2] !== 'asc-uikit') {
            add(
              'query-key-prefix',
              file,
              `queryKey starts with '${m[2]}'`,
              "queryKey starts with 'asc-uikit'",
              `change the first queryKey entry to 'asc-uikit'`,
            );
          }
        }

        // Rule: the verb is plain, not wrapped in useCallback.
        if (/\buseCallback\b/.test(src)) {
          add(
            'no-usecallback',
            file,
            'wraps its verb in useCallback',
            'a plain function — the verb is called from event handlers',
            'unwrap the useCallback',
          );
        }

        // Rule: the exposed verb is bare.
        for (const key of returned) {
          if (/^(request|do|handle)[A-Z]/.test(key)) {
            add(
              'verb-naming',
              file,
              `exposes ${key}`,
              'bare verbs — addReaction, block, deleteMessage',
              `rename ${key} to its bare verb`,
            );
          }
        }
      }
    }
  }
}

// ── 7: live primitives never escape hooks/ ────────────────────────────────────
const hookDirs = MODULES.flatMap((m) => Object.keys(KINDS).map((k) => `src/v4/${m}/hooks/${k}/`));
for (const file of walk(at('src/v4'))) {
  const path = rel(file);
  if (hookDirs.some((d) => path.startsWith(d))) continue;
  if (path.includes('useLiveObjectV4') || path.includes('useLiveCollectionV4')) continue;
  if (!inScope(file)) continue;
  const src = read(file) ?? '';
  for (const primitive of LIVE_PRIMITIVES) {
    if (new RegExp(`\\b${primitive}\\s*[(<]`).test(src)) {
      const kind = primitive === 'useLiveObjectV4' ? 'objects' : 'collections';
      add(
        'primitive-escape',
        file,
        `calls ${primitive} outside hooks/${kind}/`,
        `${primitive} is only ever called from a hook in hooks/${kind}/`,
        `wrap it in a use<Noun>${KINDS[kind].suffix} hook and call that instead`,
      );
    }
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify(violations, null, 2));
  process.exit(violations.length === 0 ? 0 : 1);
}

const bySeverity = { safe: [], breaking: [], advisory: [] };
for (const v of violations) (bySeverity[v.severity] ??= []).push(v);

const label = {
  safe: '🔧 SAFE (auto-fixable)',
  breaking: '⚠️  BREAKING (flag for human)',
  advisory: 'ℹ️  ADVISORY',
};
for (const sev of ['safe', 'breaking', 'advisory']) {
  const list = bySeverity[sev];
  if (!list.length) continue;
  console.log(`\n${label[sev]} — ${list.length}`);
  for (const v of list) {
    console.log(`  • [${v.rule}] ${v.file}: ${v.actual}  →  ${v.expected}`);
    console.log(`      ${v.fix}`);
  }
}

console.log(
  `\n${violations.length === 0 ? `✅ sdk-hooks: ${hookFiles.length} hooks pass all checks` : `❌ sdk-hooks: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`}`,
);
process.exit(violations.length === 0 ? 0 : 1);
