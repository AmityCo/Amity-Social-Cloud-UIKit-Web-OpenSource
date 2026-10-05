// Icon gate. Enforces .claude/skills/create-icon/SKILL.md: a design icon is a compound
// Regular/Light/Solid component that tints with currentColor, spreads its props and is
// exported from the barrel — and a glyph lives in the icon folder rather than inlined in a
// button.
//
// Run:  node governance/gates/09-check-icons.mjs              (whole tree)
//       node governance/gates/09-check-icons.mjs <files...>   (only those — lint-staged)
//       node governance/gates/09-check-icons.mjs --json       (machine-readable)
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

const DESIGN_ICONS = 'src/v4/core/design/icons';
const LEGACY_ICONS = 'src/v4/icons';

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

const violations = [];
const add = (rule, severity, file, actual, expected, fix) =>
  violations.push({ rule, severity, file: rel(file), actual, expected, fix });

function walk(dir, out = []) {
  if (!isDir(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

const iconFiles = (root) =>
  isDir(at(root))
    ? readdirSync(at(root))
        .filter((f) => f.endsWith('.tsx') && !f.startsWith('index.'))
        .map((f) => at(root, f))
    : [];

// ── the design set: the rules apply in full ─────────────────────────────────
const barrel = read(at(DESIGN_ICONS, 'index.ts')) ?? '';

for (const file of iconFiles(DESIGN_ICONS)) {
  if (!inScope(file)) continue;
  const name = file
    .split('/')
    .pop()
    .replace(/\.tsx$/, '');
  const src = read(file) ?? '';

  for (const m of src.matchAll(/(fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)) {
    add(
      'currentcolor',
      'safe',
      file,
      `${m[1]}="${m[2]}"`,
      `${m[1]}="currentColor"`,
      `replace ${m[2]} with currentColor — a literal cannot follow the theme`,
    );
  }

  if (!/Object\.assign\(/.test(src)) {
    add(
      'compound-export',
      'safe',
      file,
      `${name} is not a compound export`,
      'export const X = Object.assign(Regular, { Regular, … })',
      `wrap ${name} so <${name} /> renders Regular and <${name}.Solid /> the variants`,
    );
  }

  if (!/\{\.\.\.props\}/.test(src)) {
    add(
      'props-spread',
      'safe',
      file,
      `${name} does not spread its props onto the <svg>`,
      '{...props} after the fixed attributes',
      `spread {...props} so callers can pass className, width or aria-hidden`,
    );
  }

  if (!new RegExp(`from '\\./${name}'`).test(barrel)) {
    add(
      'barrel',
      'safe',
      file,
      `${name} is not exported from ${DESIGN_ICONS}/index.ts`,
      'every design icon is in the barrel',
      `add export { ${name} } from './${name}' to the barrel`,
    );
  }
}

// ── the legacy set: only flag colour, and only as advisory ──────────────────
for (const file of iconFiles(LEGACY_ICONS)) {
  if (!inScope(file)) continue;
  const src = read(file) ?? '';
  const hits = [...src.matchAll(/(fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)];
  if (!hits.length) continue;
  add(
    'currentcolor',
    'advisory',
    file,
    `${hits.length} hardcoded colour(s) in a legacy icon`,
    'currentColor',
    'the legacy set retires with the design migration — move the icon to core/design/icons rather than patching it here',
  );
}

// ── a glyph belongs in the icon folder, not inlined in a button ─────────────
for (const file of walk(at('src/v4'))) {
  const path = rel(file);
  if (path.includes('/icons/') || path.includes('/illustrations/')) continue;
  if (!inScope(file)) continue;
  const src = read(file) ?? '';
  if (!src.includes('<svg')) continue;
  // Spinners, rings and masks legitimately draw their own SVG.
  if (/<animate|animation|@keyframes/i.test(src)) continue;
  const paths = (src.match(/<path/g) ?? []).length;
  if (paths < 1 || paths > 2) continue;

  add(
    'inlined-glyph',
    'advisory',
    file,
    `inlines an <svg> with ${paths} path(s)`,
    'glyphs live in core/design/icons and are rendered as a component',
    'move the glyph to an icon component — unless this is a ring, mask or avatar frame rather than a glyph',
  );
}

if (JSON_OUT) {
  console.log(JSON.stringify(violations, null, 2));
  process.exit(violations.length === 0 ? 0 : 1);
}

const bySeverity = { safe: [], breaking: [], advisory: [] };
for (const v of violations) (bySeverity[v.severity] ??= []).push(v);

const label = {
  safe: '🔧 SAFE (design set)',
  breaking: '⚠️  BREAKING (flag for human)',
  advisory: 'ℹ️  ADVISORY (legacy set / needs judgement)',
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
      ? '✅ icons: compound exports, currentColor, barrel complete'
      : `❌ icons: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`
  }`,
);
process.exit(violations.length === 0 ? 0 : 1);
