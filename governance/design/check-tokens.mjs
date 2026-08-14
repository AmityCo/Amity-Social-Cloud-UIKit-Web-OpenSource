// Token integrity gate. Fails (exit 1) on any drift between the token layers:
//   1. root amity-uikit.config.json theme  ==  hardcoded defaultConfig.theme (utils.ts)
//      — these are two hand-maintained copies of the same atomic values; they MUST match.
//   2. every alias  {theme.X}   →  X exists as a config theme key.
//   3. every semantic {Alias}   →  Alias exists in the alias map (hex + {theme.X} refs allowed).
//   4. config + semantic light/dark key parity.
// Run: node governance/design/verify-tokens.mjs   (also wired into lint-staged for token files)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..', '..');
const at = (...p) => join(ROOT, ...p);

const config = JSON.parse(readFileSync(at('amity-uikit.config.json'), 'utf8'));
const tokens = JSON.parse(
  readFileSync(at('src/v4/core/design/tokens/amity-uikit-design-tokens.json'), 'utf8'),
);
const utilsSrc = readFileSync(at('src/v4/core/providers/CustomizationProvider/utils.ts'), 'utf8');

// String-aware match of the object literal starting at the first `{` after `marker`.
function objectAfter(src, marker) {
  const start = src.indexOf('{', src.indexOf(marker));
  let depth = 0;
  let inStr = false;
  let quote;
  let esc = false;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === quote) inStr = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      inStr = true;
      quote = c;
    } else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error(`Could not match braces after "${marker}"`);
}

// defaultConfig.theme is a pure object literal (no spreads/refs) → safe to eval.
const defaultTheme = eval(
  '(' + objectAfter(utilsSrc.slice(utilsSrc.indexOf('export const defaultConfig')), 'theme:') + ')',
);

const errors = [];
const norm = (v) => String(v).toLowerCase().trim();
const MODES = ['light', 'dark'];

// 1. config.theme == defaultConfig.theme
for (const mode of MODES) {
  const cfg = config.theme?.[mode] ?? {};
  const def = defaultTheme?.[mode] ?? {};
  for (const key of new Set([...Object.keys(cfg), ...Object.keys(def)])) {
    if (cfg[key] == null) errors.push(`sync: ${mode}.${key} is in defaultConfig but NOT in config`);
    else if (def[key] == null)
      errors.push(`sync: ${mode}.${key} is in config but NOT in defaultConfig`);
    else if (norm(cfg[key]) !== norm(def[key]))
      errors.push(
        `sync: ${mode}.${key} value mismatch — config ${cfg[key]} vs defaultConfig ${def[key]}`,
      );
  }
}

// 2. config light/dark parity
{
  const l = Object.keys(config.theme.light);
  const d = new Set(Object.keys(config.theme.dark));
  l.filter((k) => !d.has(k)).forEach((k) =>
    errors.push(`parity: config.${k} in light but not dark`),
  );
  [...d]
    .filter((k) => !config.theme.light[k])
    .forEach((k) => errors.push(`parity: config.${k} in dark but not light`));
}

// 3. alias {theme.X} → config key exists
const cfgKeys = new Set(Object.keys(config.theme.light));
for (const [name, ref] of Object.entries(tokens.alias)) {
  const m = String(ref).match(/^\{theme\.([^}]+)\}$/);
  if (!m) errors.push(`alias: "${name}" has unexpected form: ${ref}`);
  else if (!cfgKeys.has(m[1]))
    errors.push(`alias: "${name}" → theme.${m[1]} does not exist in config`);
}

// 4. semantic {Alias} → alias key exists (+ light/dark parity)
const aliasKeys = new Set(Object.keys(tokens.alias));
for (const [name, modes] of Object.entries(tokens.semantic)) {
  for (const mode of MODES) {
    const ref = modes[mode];
    if (ref == null) continue;
    const s = String(ref);
    if (s.startsWith('#')) continue;
    const n = s.replace(/^\{|\}$/g, '');
    if (n.startsWith('theme.')) continue;
    if (!aliasKeys.has(n)) errors.push(`semantic: "${name}".${mode} → "${n}" is not a known alias`);
  }
  if ((modes.light == null) !== (modes.dark == null))
    errors.push(`parity: semantic "${name}" defines only one of light/dark`);
}

if (errors.length) {
  console.error(`✗ Token gate FAILED (${errors.length} issue${errors.length > 1 ? 's' : ''}):`);
  errors.forEach((e) => console.error('  • ' + e));
  process.exit(1);
}
console.log(
  `✓ Token gate passed — config↔defaultConfig in sync (${Object.keys(config.theme.light).length} atomic), ` +
    `${Object.keys(tokens.alias).length} alias + ${Object.keys(tokens.semantic).length} semantic all resolve.`,
);
