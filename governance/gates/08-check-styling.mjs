// Styling gate. Enforces .claude/skills/styling/SKILL.md: lengths in rem, colours from the
// --asc-color-* tokens, and variants driven by data-attributes rather than conditional class
// names.
//
// Type properties (font-size, line-height, font-weight, font-family) are deliberately NOT
// checked here — they belong to the Typography component and gate 05 owns them.
//
// Run:  node governance/gates/08-check-styling.mjs              (whole tree)
//       node governance/gates/08-check-styling.mjs <files...>   (only those — lint-staged)
//       node governance/gates/08-check-styling.mjs --json       (machine-readable)
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

// Hairlines and the pill-radius idiom do not convert meaningfully to rem.
const PX_ALLOWED = new Set(['0', '0.5', '1', '-1', '2', '9999']);

const SEVERITY = {
  'px-length': 'safe',
  'conditional-class': 'safe',
  'hardcoded-colour': 'advisory',
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

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

function walk(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

const all = walk(at('src/v4'));

// ── CSS: lengths in rem, colours from tokens ────────────────────────────────
for (const file of all.filter((f) => f.endsWith('.css'))) {
  if (!inScope(file)) continue;
  const src = stripCssComments(read(file) ?? '');

  for (const m of src.matchAll(/(-?\d*\.?\d+)px\b/g)) {
    if (PX_ALLOWED.has(m[1])) continue;
    const rem = Number(m[1]) / 16;
    add(
      'px-length',
      file,
      `line ${lineOf(src, m.index)}: ${m[1]}px`,
      'lengths are expressed in rem',
      `${m[1]}px → ${rem}rem`,
    );
  }

  for (const m of src.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    add(
      'hardcoded-colour',
      file,
      `line ${lineOf(src, m.index)}: ${m[0]}`,
      'colours come from the --asc-color-* tokens',
      `replace ${m[0]} with the token that carries it — a literal cannot follow the theme`,
    );
  }
}

// ── TSX: variants via data-attributes, not conditional class names ──────────
for (const file of all.filter((f) => f.endsWith('.tsx'))) {
  if (!inScope(file)) continue;
  const src = read(file) ?? '';
  // clsx(...) with one nesting level of parens, so multi-line calls are caught too.
  for (const m of src.matchAll(/clsx\((?:[^()]|\([^()]*\))*\)/g)) {
    if (!/(&&|\?)\s*styles[.[]/.test(m[0])) continue; // `a?.className` is not a conditional class
    add(
      'conditional-class',
      file,
      `line ${lineOf(src, m.index)}: ${m[0].replace(/\s+/g, ' ').slice(0, 72)}`,
      'variants are driven by data-attributes',
      "render a data-* attribute and select it in CSS with [data-x='y']",
    );
  }
}

if (JSON_OUT) {
  console.log(JSON.stringify(violations, null, 2));
  process.exit(violations.length === 0 ? 0 : 1);
}

const bySeverity = { safe: [], breaking: [], advisory: [] };
for (const v of violations) (bySeverity[v.severity] ??= []).push(v);

const label = {
  safe: '🔧 SAFE (mechanical)',
  breaking: '⚠️  BREAKING (flag for human)',
  advisory: 'ℹ️  ADVISORY (needs a design decision)',
};
const byRule = new Map();
for (const v of violations) byRule.set(v.rule, (byRule.get(v.rule) ?? 0) + 1);

for (const sev of ['safe', 'breaking', 'advisory']) {
  const list = bySeverity[sev];
  if (!list.length) continue;
  console.log(`\n${label[sev]} — ${list.length}`);
  for (const v of list.slice(0, 40)) {
    console.log(`  • [${v.rule}] ${v.file}: ${v.actual}  →  ${v.expected}`);
    console.log(`      ${v.fix}`);
  }
  if (list.length > 40) console.log(`  … and ${list.length - 40} more (use --json for all)`);
}

console.log(
  `\n${
    violations.length === 0
      ? '✅ styling: rem lengths, token colours, data-attribute variants'
      : `❌ styling: ${violations.length} violation(s) — ${[...byRule].map(([r, n]) => `${n} ${r}`).join(', ')}`
  }`,
);
process.exit(violations.length === 0 ? 0 : 1);
