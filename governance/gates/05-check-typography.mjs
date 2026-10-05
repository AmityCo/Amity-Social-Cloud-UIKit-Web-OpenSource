// Typography gate. Enforces .claude/skills/typography/SKILL.md: the Typography component
// owns the type scale, so no CSS module sets font-size / font-weight / font-family /
// line-height, no code references the legacy --asc-text-* properties, and no raw element
// holds visible text.
//
// Run:  node governance/gates/05-check-typography.mjs              (whole tree)
//       node governance/gates/05-check-typography.mjs <files...>   (only those — lint-staged)
//       node governance/gates/05-check-typography.mjs --json       (machine-readable)
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

// The Typography component is the one place allowed to declare the scale.
const TYPOGRAPHY_DIR = 'src/v4/core/components/Typography/';

// The variants Typography ships, read from its own stylesheet at runtime so this gate
// cannot drift from the component.
const VARIANTS = (() => {
  const css = readFileSync(at(TYPOGRAPHY_DIR, 'Typography.module.css'), 'utf8');
  const out = [];
  for (const m of css.matchAll(/\.typography__(\w+)\s*\{([^}]*)\}/g)) {
    const body = m[2];
    const pick = (prop) => body.match(new RegExp(`${prop}:\\s*([^;]+)`))?.[1]?.trim();
    out.push({
      name: m[1],
      'font-size': pick('font-size'),
      'line-height': pick('line-height'),
      'font-weight': pick('font-weight'),
    });
  }
  return out;
})();

const pascal = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Which variants already have this value for this property.
const matching = (prop, value) =>
  VARIANTS.filter((v) => v[prop] === value).map((v) => `Typography.${pascal(v.name)}`);

const SEVERITY_BY_RULE = {
  'css-font-family': 'safe',
  'legacy-token': 'advisory',
  'raw-text-element': 'advisory',
};

const violations = [];
const add = (rule, file, actual, expected, fix, severity) =>
  violations.push({
    rule,
    severity: severity ?? SEVERITY_BY_RULE[rule] ?? 'advisory',
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

const all = walk(at('src/v4'));
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

// ── CSS modules must not set type ───────────────────────────────────────────
const TYPE_PROPS = ['font-size', 'line-height', 'font-weight', 'font-family'];

for (const file of all.filter((f) => f.endsWith('.module.css'))) {
  if (rel(file).startsWith(TYPOGRAPHY_DIR)) continue; // the system itself
  if (!inScope(file)) continue;
  const src = read(file) ?? '';

  for (const prop of TYPE_PROPS) {
    for (const m of src.matchAll(new RegExp(`(?<![-\\w])${prop}\\s*:\\s*([^;}]+)`, 'g'))) {
      const value = m[1].trim();
      const line = lineOf(src, m.index);

      if (prop === 'font-family') {
        add(
          'css-font-family',
          file,
          `line ${line}: font-family: ${value}`,
          'Typography supplies the font family',
          'delete the font-family declaration',
        );
        continue;
      }

      const hits = matching(prop, value);
      // Only an unambiguous match is a mechanical fix. `font-weight: 600` alone fits
      // three variants, so it still needs someone to pick one.
      add(
        `css-${prop}`,
        file,
        `line ${line}: ${prop}: ${value}`,
        'Typography owns the type scale',
        hits.length === 1
          ? `that is ${hits[0]} — delete the declaration and use the variant`
          : hits.length > 1
            ? `${value} fits ${hits.join(' / ')} — pick one, then delete the declaration`
            : `${value} matches no Typography variant — a design decision, not a stylesheet override`,
        hits.length === 1 ? 'safe' : 'advisory',
      );
    }
  }
}

// ── nothing references the legacy properties ────────────────────────────────
const LEGACY = /var\(\s*(--asc-text-[\w-]+|--asc-line-height-[\w-]+|--typography-[\w-]+)/g;

for (const file of all.filter((f) => /\.(module\.css|tsx?)$/.test(f))) {
  if (rel(file).startsWith(TYPOGRAPHY_DIR)) continue;
  if (!inScope(file)) continue;
  const src = read(file) ?? '';
  for (const m of src.matchAll(LEGACY)) {
    add(
      'legacy-token',
      file,
      `line ${lineOf(src, m.index)}: ${m[1]}`,
      'the Typography variants, not the legacy custom properties',
      `replace ${m[1]} with the Typography variant that matches`,
    );
  }
}

// ── no raw element holds visible text ───────────────────────────────────────
const TEXT_TAGS = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

for (const file of all.filter((f) => f.endsWith('.tsx'))) {
  if (rel(file).startsWith(TYPOGRAPHY_DIR)) continue;
  if (!inScope(file)) continue;
  const src = read(file) ?? '';

  for (const tag of TEXT_TAGS) {
    const re = new RegExp(`<${tag}(\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g');
    for (const m of src.matchAll(re)) {
      const inner = m[2].trim();
      // A wrapper around another element is fine; an element holding text is not.
      // An expression that renders JSX is a wrapper too, not a string.
      if (!inner || inner.startsWith('<')) continue;
      if (inner.startsWith('{') && inner.includes('<')) continue;
      const preview = inner.replace(/\s+/g, ' ').slice(0, 48);
      add(
        'raw-text-element',
        file,
        `line ${lineOf(src, m.index)}: <${tag}> holds text — ${preview}`,
        'every visible string renders through Typography',
        `wrap it in the Typography variant this text should be, with as="${tag}" if the tag matters`,
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
  safe: '🔧 SAFE (variant already exists)',
  breaking: '⚠️  BREAKING (flag for human)',
  advisory: 'ℹ️  ADVISORY (needs a design decision)',
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
  `\n${
    violations.length === 0
      ? `✅ typography: every text uses Typography (${VARIANTS.length} variants)`
      : `❌ typography: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`
  }`,
);
process.exit(violations.length === 0 ? 0 : 1);
