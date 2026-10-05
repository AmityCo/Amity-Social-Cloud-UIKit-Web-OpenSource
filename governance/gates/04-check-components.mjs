// Component gate. Enforces the chain in .claude/skills/create-component/SKILL.md:
// folder / file / component / stylesheet share one name, the component carries its
// useAmityComponent scaffolding, its componentId is registered, and it is exported
// publicly only when its tech spec says isPublic: true.
//
// The spec check needs the cleverden specs, which live outside this repo. It is skipped
// silently when they are not found. Point at them with UIKIT_SPECS_DIR to enable it.
//
// Run:  node governance/gates/04-check-components.mjs              (whole tree)
//       node governance/gates/04-check-components.mjs <files...>   (only those — lint-staged)
//       node governance/gates/04-check-components.mjs --json       (machine-readable)
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

// Customizable component surfaces. core/components are design primitives, not customizable
// surfaces, so they are out of scope.
const COMPONENT_ROOTS = ['src/v4/social/components', 'src/v4/chat/components'];

const SPECS_DIR =
  process.env.UIKIT_SPECS_DIR ??
  at('..', '..', '..', 'Docs/cleverden/front-end-tech-specs/UIKIT/components');

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

// SAFE     — a local fix with no consumer-visible effect.
// BREAKING — changes consumer-facing API; a human decides.
// ADVISORY — needs a judgement call (which page scope, whether to publish).
const SEVERITY = {
  'css-naming': 'safe',
  'dead-stylesheet': 'safe',
  barrel: 'safe',
  'component-id': 'safe',
  'theme-styles': 'safe',
  'accessibility-id': 'safe',
  'is-excluded': 'safe',
  'hardcoded-page-id': 'safe',
  'public-export': 'breaking',
  'missing-public-export': 'advisory',
  'unregistered-component-id': 'advisory',
  'dead-component-id': 'advisory',
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

const rootIndex = read(at('src/index.ts')) ?? '';
const registry = read(at('src/v4/core/providers/CustomizationProvider/utils.ts')) ?? '';

// Public aliases exported as `X as AmityXComponent` from src/index.ts.
const publicAliases = new Map(); // internal symbol -> public alias
for (const m of rootIndex.matchAll(/([A-Za-z0-9_]+)\s+as\s+(Amity[A-Za-z0-9_]+)/g)) {
  publicAliases.set(m[1], m[2]);
}

// componentIds the registry declares, from every `<page>/<componentId>/<element>` key.
const registeredIds = new Set();
for (const m of registry.matchAll(/'([^']*?)\/([^'/]+)\/([^'/]+)'\s*:/g)) {
  if (m[2] !== '*') registeredIds.add(m[2]);
}

// The COMPONENT_ID registry — ids live here, never as literals at the call site.
const constants = new Map(); // NAME -> value
{
  const customization = read(at('src/v4/constants/customization.ts')) ?? '';
  const block = customization.match(/export const COMPONENT_ID\s*=\s*\{([\s\S]*?)\n\};/);
  for (const m of (block?.[1] ?? '').matchAll(/([A-Z0-9_]+)\s*:\s*'([^']+)'/g)) {
    constants.set(m[1], m[2]);
  }
}

const seenIds = new Set();
let scanned = 0;

for (const compRoot of COMPONENT_ROOTS) {
  const rootPath = at(compRoot);
  if (!isDir(rootPath)) continue;

  for (const name of readdirSync(rootPath)) {
    const folder = join(rootPath, name);
    if (!isDir(folder)) continue;

    const file = join(folder, `${name}.tsx`);
    if (!existsSync(file)) continue; // not a component folder
    scanned++;

    const src = read(file) ?? '';
    const files = readdirSync(folder);

    const usesHook = /\buseAmityComponent\b/.test(src);
    const literalId = src.match(/const\s+componentId\s*=\s*'([^']+)'/)?.[1];
    const constName = src.match(/const\s+componentId\s*=\s*COMPONENT_ID\.([A-Z0-9_]+)/)?.[1];
    const resolvedId = constName ? constants.get(constName) : literalId;
    if (resolvedId) seenIds.add(resolvedId);

    if (!inScope(file)) continue;

    // ── stylesheet shares the component's name ────────────────────────────────
    const css = files.filter((f) => f.endsWith('.module.css'));
    if (css.length > 0 && !css.includes(`${name}.module.css`)) {
      add(
        'css-naming',
        file,
        `stylesheet is ${css.join(', ')}`,
        `${name}.module.css`,
        `rename the stylesheet to ${name}.module.css`,
      );
    }

    // ── an unimported stylesheet is dead ──────────────────────────────────────
    // A sheet may be imported by any sibling in the folder, not just <X>.tsx.
    const folderSources = [];
    (function collect(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, entry.name);
        if (entry.isDirectory()) collect(p);
        else if (/\.tsx?$/.test(entry.name)) folderSources.push(read(p) ?? '');
      }
    })(folder);

    for (const sheet of css) {
      if (!folderSources.some((s) => s.includes(sheet))) {
        add(
          'dead-stylesheet',
          join(folder, sheet),
          `${sheet} is imported by nothing in ${name}/`,
          'every stylesheet in the folder is imported',
          `delete ${sheet}, or import it`,
        );
      }
    }

    // ── folder barrel re-exports the component ────────────────────────────────
    const barrel = read(join(folder, 'index.ts')) ?? read(join(folder, 'index.tsx'));
    if (barrel == null) {
      add(
        'barrel',
        file,
        `${name}/ has no index.ts`,
        'every component folder has a barrel',
        `add ${rel(join(folder, 'index.ts'))} re-exporting ${name}`,
      );
    } else if (!new RegExp(`\\b${name}\\b`).test(barrel)) {
      add(
        'barrel',
        file,
        `${name}/index does not re-export ${name}`,
        `export { ${name} } from './${name}'`,
        `re-export ${name} from its folder barrel`,
      );
    }

    // A component may be published through the module barrel or by its own path;
    // both are valid and tsc already fails on a broken export path, so the module
    // barrel is deliberately not checked here.

    // ── scaffolding ───────────────────────────────────────────────────────────
    if (usesHook) {
      if (literalId) {
        add(
          'component-id',
          file,
          `componentId is the raw string '${literalId}'`,
          'const componentId = COMPONENT_ID.<NAME>',
          `add <NAME>: '${literalId}' to COMPONENT_ID in src/v4/constants/customization.ts and reference it`,
        );
      } else if (constName && !constants.has(constName)) {
        add(
          'component-id',
          file,
          `COMPONENT_ID.${constName} is not defined`,
          'every referenced COMPONENT_ID entry exists',
          `add ${constName} to COMPONENT_ID in src/v4/constants/customization.ts`,
        );
      } else if (!resolvedId) {
        add(
          'component-id',
          file,
          'componentId cannot be resolved',
          'const componentId = COMPONENT_ID.<NAME>',
          'declare componentId from the COMPONENT_ID registry',
        );
      }

      if (resolvedId && registeredIds.size > 0 && !registeredIds.has(resolvedId)) {
        add(
          'unregistered-component-id',
          file,
          `componentId '${resolvedId}' is in no customization key`,
          'the registry declares this componentId',
          `add '<page>/${resolvedId}/*': {} to CustomizationProvider/utils.ts`,
        );
      }

      if (!/style=\{themeStyles\}/.test(src)) {
        add(
          'theme-styles',
          file,
          'themeStyles is never applied to an element',
          'style={themeStyles} on the root element',
          'apply style={themeStyles}, or the component ignores its theme config',
        );
      }

      if (!/data-testid=\{accessibilityId\}/.test(src)) {
        add(
          'accessibility-id',
          file,
          'accessibilityId is not wired to a data-testid',
          'data-testid={accessibilityId} on the root element',
          `render ${name}'s root element with data-testid={accessibilityId}`,
        );
      }

      if (!/\bisExcluded\b/.test(src)) {
        add(
          'is-excluded',
          file,
          'isExcluded is never read',
          'if (isExcluded) return null',
          'honour isExcluded, or the component cannot be switched off by config',
        );
      }
    }

    // ── pageId is a prop, never a literal ─────────────────────────────────────
    const hardcoded = src.match(/\bpageId\s*=\s*'([^']+)'/);
    if (hardcoded && hardcoded[1] !== '*') {
      add(
        'hardcoded-page-id',
        file,
        `pageId defaults to '${hardcoded[1]}'`,
        "pageId = '*', with the host page passing its own id",
        'take pageId as a prop defaulting to *; a literal collapses every host into one namespace',
      );
    }
  }
}

// ── registry keys nothing implements ────────────────────────────────────────
if (!SCOPE) {
  const allSrc = [];
  (function walk(dir) {
    if (!isDir(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(entry.name)) allSrc.push(p);
    }
  })(at('src/v4'));

  const usedAnywhere = new Set(seenIds);
  for (const f of allSrc) {
    const s = read(f) ?? '';
    for (const m of s.matchAll(/componentId\s*[=:]\s*'([^']+)'/g)) usedAnywhere.add(m[1]);
    for (const m of s.matchAll(/COMPONENT_ID\.([A-Z0-9_]+)/g)) {
      const v = constants.get(m[1]);
      if (v) usedAnywhere.add(v);
    }
  }

  for (const id of [...registeredIds].sort()) {
    if (!usedAnywhere.has(id)) {
      add(
        'dead-component-id',
        at('src/v4/core/providers/CustomizationProvider/utils.ts'),
        `'${id}' is registered but no component uses it`,
        'every registered componentId is implemented',
        `remove the '${id}' keys, or point a component at that id`,
      );
    }
  }
}

// Every folder in the tree that holds a component of the same name, so the spec
// check can tell "not built yet" from "built but unexported".
const implFolders = new Map();
if (!SCOPE) {
  (function collect(dir) {
    if (!isDir(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const p = join(dir, entry.name);
      if (existsSync(join(p, `${entry.name}.tsx`)) && !implFolders.has(entry.name)) {
        implFolders.set(entry.name, p);
      }
      collect(p);
    }
  })(at('src/v4'));
}

// ── spec isPublic vs the public export ──────────────────────────────────────
let specNote = null;
if (SCOPE) {
  // A whole-tree concern: never fail a commit over a file it did not touch.
} else if (isDir(SPECS_DIR)) {
  for (const specName of readdirSync(SPECS_DIR)) {
    const specFile = join(SPECS_DIR, specName, 'v1.md');
    const head = read(specFile)?.slice(0, 3000);
    if (head == null) continue;
    const uiType = head.match(/^uiType:\s*"?(\w+)"?/m)?.[1];
    if (uiType !== 'component') continue;
    const isPublic = head.match(/^isPublic:\s*"?(\w+)"?/m)?.[1];
    if (isPublic == null) continue;

    const alias = specName.startsWith('Amity') ? specName : `Amity${specName}`;
    const exported = [...publicAliases.values()].includes(alias);

    if (isPublic === 'false' && exported) {
      add(
        'public-export',
        at('src/index.ts'),
        `${alias} is exported but its spec says isPublic: false`,
        'only isPublic: true components are exported',
        `remove ${alias} from src/index.ts, or change the spec`,
      );
      continue;
    }

    if (isPublic !== 'true' || exported) continue;

    // A spec may land before its component does. Only a component that actually
    // exists in the tree can be missing a public export.
    const bare = specName.replace(/^Amity/, '').replace(/Component$/, '');
    const built = implFolders.get(bare) ?? implFolders.get(specName);
    if (!built) continue;

    add(
      'missing-public-export',
      built,
      `${alias} is built but not exported, though its spec says isPublic: true`,
      `export it from src/index.ts as ${alias}`,
      `add the ${alias} export to src/index.ts, or change the spec`,
    );
  }
} else {
  specNote = `spec check skipped — set UIKIT_SPECS_DIR (looked in ${SPECS_DIR})`;
}

// Specs are the rule for new public components; they do not cover the ones that
// predate them. Report that coverage, never fail on it.
let coverageNote = null;
if (!SCOPE && isDir(SPECS_DIR)) {
  const specNames = new Set(
    readdirSync(SPECS_DIR)
      .filter((d) => existsSync(join(SPECS_DIR, d, 'v1.md')))
      .map((d) => (d.startsWith('Amity') ? d : `Amity${d}`)),
  );
  const publicComponents = [...publicAliases.values()].filter((a) => a.endsWith('Component'));
  const withSpec = publicComponents.filter((a) => specNames.has(a));
  coverageNote =
    `spec coverage: ${withSpec.length}/${publicComponents.length} public components have a spec ` +
    `(${publicComponents.length - withSpec.length} predate the spec process — not a violation)`;
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

if (specNote) console.log(`\nℹ️  ${specNote}`);
if (coverageNote) console.log(`\nℹ️  ${coverageNote}`);

console.log(
  `\n${violations.length === 0 ? `✅ components: ${scanned} components pass all checks` : `❌ components: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`}`,
);
process.exit(violations.length === 0 ? 0 : 1);
