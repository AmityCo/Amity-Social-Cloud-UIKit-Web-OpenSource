// Module-gate flag check. Reports every `useAmityPage` / `useAmityComponent` /
// `useAmityElement` call whose `isExcluded` is never read.
//
// This is the failure the id tables cannot see. `03-check-config-owners.mjs`
// proves a surface has an owner; this one asks whether anybody listens. A page
// that resolves its flag and drops it renders exactly as before, while the
// manifest — which measures the decision, not the render — reports it as
// hidden. So the gate says withheld, the screen says otherwise, and the report
// agrees with the gate. `moduleGraph.ts`'s header calls this the dangerous
// kind, and marks the pages it knows about on the rows themselves.
//
// Soft on purpose, and baselined. It reads structure with a regex, so it
// cannot tell a component that legitimately has nothing to hide from one that
// forgot — a wrapper hook that re-exports the flag for its caller to use is
// indistinguishable here from one that swallows it. `.husky/pre-commit` runs it
// with `|| true`; the exit code is for CI, which can afford to be strict.
//
// Run: node governance/module-gate/check-flag-consumed.mjs
//      UPDATE_GATE_FLAG_BASELINE=1 node governance/module-gate/check-flag-consumed.mjs
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..', '..', 'src', 'v4');
const BASELINE = join(DIR, 'flag-consumed.baseline.json');

const files = [];
const walk = (d) => {
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    if (statSync(p).isDirectory()) {
      // `core/hooks/uikit` is where the three hooks are defined, and
      // `useAmityComponent` / `useAmityPage` delegate to `useAmityElement`
      // there. Calls in that folder are the implementation, not a consumer.
      if (!/__tests__|node_modules|uikit/.test(name)) walk(p);
    } else if (/\.tsx?$/.test(name) && !/\.test\.|\.stories\./.test(p)) {
      files.push(p);
    }
  }
};
walk(ROOT);

const HOOKS = 'useAmity(?:Page|Component|Element)';
// `const { a, b } = useAmityX(` or `const x = useAmityX(`. `[^}]` matches
// newlines, so a destructuring spread over several lines is one match.
const BOUND = new RegExp(
  `(?:const|let|var)\\s+(\\{[^}]*\\}|[A-Za-z_$][\\w$]*)\\s*=\\s*(${HOOKS})\\s*\\(`,
  'g',
);
const ANY_CALL = new RegExp(`(${HOOKS})\\s*\\(`, 'g');

const found = [];

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const rel = file.slice(file.indexOf('src/'));

  const bound = [...source.matchAll(BOUND)];
  const calls = [...source.matchAll(ANY_CALL)];

  // Called and thrown away outright — no binding at all.
  if (calls.length > bound.length) {
    found.push(`${rel} :: ${calls.length - bound.length} call(s) with no binding`);
  }

  for (const [, lhs, hook] of bound) {
    let name;
    // How many occurrences mean "read somewhere". Destructuring puts the name
    // in the binding itself, so that form needs a second one; keeping the whole
    // object does not, and `x.isExcluded` appearing once is a read.
    let needed;

    if (lhs.startsWith('{')) {
      const m = lhs.match(/\bisExcluded\s*(?::\s*([A-Za-z_$][\w$]*))?/);
      if (!m) {
        found.push(`${rel} :: ${hook} resolves the flag and does not take it`);
        continue;
      }
      name = m[1] ?? 'isExcluded';
      needed = 2;
    } else {
      name = `${lhs}.isExcluded`;
      needed = 1;
    }

    const uses = source.split(new RegExp(`\\b${name.replace('.', '\\.')}\\b`)).length - 1;
    if (uses < needed) found.push(`${rel} :: ${hook} binds ${name} and never reads it`);
  }
}

// One hop further. A wrapper hook that resolves the flag and hands it back —
// `usePastEvents`, `useEventTargetSelection`, `useEventDetail` — passes the
// check above by returning it, and the question moves to whoever calls it.
// Following that one hop is what turns "somebody returned it" into "somebody
// acted on it"; more hops than one is a call graph, and a regex has no business
// building one.
const wrappers = new Map();
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (!/return\s*\{[^}]*\bisExcluded\b/s.test(source)) continue;
  for (const m of source.matchAll(/export\s+(?:function|const)\s+(use[A-Z][\w$]*)/g)) {
    wrappers.set(m[1], file.slice(file.indexOf('src/')));
  }
}

for (const [hook, declaredIn] of wrappers) {
  const callers = [];
  let read = false;
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const call = new RegExp(
      `(?:const|let|var)\\s+(\\{[^}]*\\}|[A-Za-z_$][\\w$]*)\\s*=\\s*${hook}\\s*\\(`,
    );
    const m = source.match(call);
    if (!m) continue;
    callers.push(file);
    const lhs = m[1];
    if (lhs.startsWith('{')) {
      const f = lhs.match(/\bisExcluded\s*(?::\s*([A-Za-z_$][\w$]*))?/);
      const name = f ? f[1] ?? 'isExcluded' : null;
      if (name && source.split(new RegExp(`\\b${name}\\b`)).length - 1 >= 2) read = true;
    } else if (source.includes(`${lhs}.isExcluded`)) {
      read = true;
    }
  }
  if (callers.length && !read) {
    found.push(`${declaredIn} :: ${hook} returns the flag and no caller reads it`);
  }
}

const unique = [...new Set(found)].sort();

if (process.env.UPDATE_GATE_FLAG_BASELINE) {
  writeFileSync(BASELINE, `${JSON.stringify(unique, null, 2)}\n`);
  console.log(`flag-consumed baseline written: ${unique.length} entries`);
  process.exit(0);
}

let baseline = [];
try {
  baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
} catch {
  console.error(
    'flag-consumed: no baseline. Create one with\n' +
      '  UPDATE_GATE_FLAG_BASELINE=1 node governance/module-gate/check-flag-consumed.mjs',
  );
  process.exit(1);
}

const added = unique.filter((k) => !baseline.includes(k));
const fixed = baseline.filter((k) => !unique.includes(k));

if (added.length) {
  console.error(
    `flag-consumed: ${added.length} new gate flag${added.length > 1 ? 's' : ''} resolved and ` +
      'never read.\nThe surface renders whatever the gate decided, and the manifest still\n' +
      'reports it as hidden — the one failure the id tables cannot see. Read\n' +
      '`isExcluded` and return null, below every hook.\n\n' +
      added.map((a) => `  ${a}`).join('\n') +
      '\n',
  );
  process.exit(1);
}

console.log(
  `flag-consumed: clean (${unique.length} known, ${fixed.length} fixed since the baseline)` +
    (fixed.length
      ? '\n  Debt paid — drop these with UPDATE_GATE_FLAG_BASELINE=1:\n' +
        fixed.map((f) => `  ${f}`).join('\n')
      : ''),
);
