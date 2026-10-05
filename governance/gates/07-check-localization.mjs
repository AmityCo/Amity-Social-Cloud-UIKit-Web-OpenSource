// Localization gate. Enforces .claude/skills/localization/SKILL.md: every key a component
// resolves exists and has a value, every locale carries the same keys with the same
// placeholder arity, and dead keys are surfaced.
//
// Keys are a cross-platform contract shared with iOS and Android, so most findings here are
// ADVISORY by nature — adding, renaming or deleting one is never a purely local fix.
//
// Run:  node governance/gates/07-check-localization.mjs              (whole tree)
//       node governance/gates/07-check-localization.mjs <files...>   (only those — lint-staged)
//       node governance/gates/07-check-localization.mjs --json       (machine-readable)
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

const LOCALE_DIR = 'src/v4/core/localization/defaults';
const BASE_LOCALE = 'en';
// Tests use fixture keys (amity_test_*) that deliberately do not exist in the catalog.
const isTest = (p) => /__tests__|\.test\.tsx?$/.test(p);

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

const SEVERITY = { 'placeholder-arity': 'safe' };

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

// ── the catalogs ────────────────────────────────────────────────────────────
const catalogs = new Map(); // locale -> { key: value }
for (const f of readdirSync(at(LOCALE_DIR))) {
  if (!f.endsWith('.json')) continue;
  catalogs.set(f.replace(/\.json$/, ''), JSON.parse(read(at(LOCALE_DIR, f))));
}
const base = catalogs.get(BASE_LOCALE) ?? {};
const baseFile = at(LOCALE_DIR, `${BASE_LOCALE}.json`);

// ── where every key is resolved from ────────────────────────────────────────
const RESOLVER = /(?:useString|resolveString|resolveText)\(\s*'([a-z0-9_]+)'/g;
// JSDoc blocks document these calls with example keys that deliberately do not exist.
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const usage = new Map(); // key -> Set<file>
for (const file of walk(at('src/v4'))) {
  if (isTest(file)) continue;
  for (const m of stripComments(read(file) ?? '').matchAll(RESOLVER)) {
    if (!usage.has(m[1])) usage.set(m[1], new Set());
    usage.get(m[1]).add(file);
  }
}

// When scoped to specific files, only judge the keys those files resolve, plus the
// catalogs themselves if they were staged.
const scopedCatalog = SCOPE == null || [...SCOPE].some((p) => p.startsWith(LOCALE_DIR));
const inScopeKey = (key) =>
  SCOPE == null || [...(usage.get(key) ?? [])].some((f) => SCOPE.has(rel(f)));

// ── a resolved key must exist, and must have a value ────────────────────────
for (const [key, files] of usage) {
  if (!inScopeKey(key)) continue;
  const where = rel([...files][0]);
  if (!(key in base)) {
    add(
      'missing-key',
      [...files][0],
      `${key} is resolved but absent from ${BASE_LOCALE}.json`,
      'every resolved key exists in the catalog',
      `fix the key name, or get approval to add ${key} — keys are a cross-platform contract`,
    );
  } else if (base[key] === '') {
    add(
      'empty-value',
      [...files][0],
      `${key} resolves to an empty string (${where})`,
      'a resolved key has a value',
      `populate ${key} in ${BASE_LOCALE}.json — it renders blank to users today`,
    );
  }
}

// ── every locale carries the same keys, with the same placeholder arity ─────
if (scopedCatalog) {
  const arity = (s) => (s.match(/%[sd@]/g) ?? []).length;
  for (const [locale, cat] of catalogs) {
    if (locale === BASE_LOCALE) continue;
    const file = at(LOCALE_DIR, `${locale}.json`);
    for (const key of Object.keys(base)) {
      if (!(key in cat)) {
        add(
          'locale-parity',
          file,
          `${key} is in ${BASE_LOCALE}.json but not ${locale}.json`,
          'every locale carries every key',
          `add ${key} to ${locale}.json`,
        );
      } else if (base[key] !== '' && cat[key] !== '' && arity(base[key]) !== arity(cat[key])) {
        add(
          'placeholder-arity',
          file,
          `${key}: ${BASE_LOCALE} has ${arity(base[key])} placeholder(s), ${locale} has ${arity(cat[key])}`,
          'placeholder counts match across locales',
          `fix the %s / %d placeholders in ${locale}.json so they match`,
        );
      }
    }
    for (const key of Object.keys(cat)) {
      if (!(key in base)) {
        add(
          'locale-parity',
          file,
          `${key} is in ${locale}.json but not ${BASE_LOCALE}.json`,
          `${BASE_LOCALE}.json is the source of truth`,
          `remove ${key} from ${locale}.json, or add it to ${BASE_LOCALE}.json`,
        );
      }
    }
  }

  // ── keys nothing resolves ─────────────────────────────────────────────────
  const unused = Object.keys(base).filter((k) => !usage.has(k));
  if (unused.length) {
    add(
      'unused-key',
      baseFile,
      `${unused.length} key(s) in ${BASE_LOCALE}.json are resolved nowhere`,
      'the catalog matches what the code renders',
      `review them before deleting — iOS and Android may still resolve the same keys. First few: ${unused.slice(0, 5).join(', ')}`,
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
  safe: '🔧 SAFE (auto-fixable)',
  breaking: '⚠️  BREAKING (flag for human)',
  advisory: 'ℹ️  ADVISORY (cross-platform contract)',
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
      ? `✅ localization: ${Object.keys(base).length} keys across ${catalogs.size} locale(s) check out`
      : `❌ localization: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`
  }`,
);
process.exit(violations.length === 0 ? 0 : 1);
