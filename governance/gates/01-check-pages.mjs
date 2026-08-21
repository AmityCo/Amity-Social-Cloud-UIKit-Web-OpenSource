// Page-naming gate. Every v4 page must follow one naming chain:
//
//   feature  X            (e.g. GroupChat)
//     → page component  XPage        exported from pages/XPage/XPage.tsx
//     → page index       export { XPage } from './XPage'
//     → public export    XPage as AmityXPage   (src/index.ts)
//
// The public export name (AmityXPage) is consumer-facing API, so a mismatch there is
// BREAKING and is only *flagged* — never auto-renamed. Folder / file / index names are
// internal, so a mismatch there is SAFE to auto-fix. (pageId is a cross-platform contract
// and is deliberately out of scope — see the note near the checks.)
//
// Run:  node governance/gates/01-check-pages.mjs        (human summary)
//       node governance/gates/01-check-pages.mjs --json (machine-readable, for the fix loop)
// Exits 1 if any violation exists.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = join(DIR, '..', '..');
const at = (...p) => join(ROOT, ...p);
const rel = (p) => relative(ROOT, p);

const PAGE_ROOTS = ['src/v4/social/pages', 'src/v4/chat/pages'];
const JSON_OUT = process.argv.includes('--json');

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

// Public page symbols exported as `XPage as AmityXPage` in src/index.ts.
const rootIndex = read(at('src/index.ts')) ?? '';
const publicAliases = new Map(); // internal symbol -> public alias
for (const m of rootIndex.matchAll(/([A-Za-z0-9]+Page)\s+as\s+(Amity[A-Za-z0-9]+Page)/g)) {
  publicAliases.set(m[1], m[2]);
}

const violations = [];
const add = (v) => violations.push(v);

// The page component a folder re-exports from its index (the first `*Page` symbol).
function canonicalFromIndex(folderPath) {
  const index = read(join(folderPath, 'index.ts')) ?? read(join(folderPath, 'index.tsx'));
  if (index == null) return { component: null, index: null };
  // Accept both relative (`./XPage`) and alias (`~/.../XPage`) re-export paths.
  const m = index.match(/export\s*\{\s*([A-Za-z0-9]+Page)\b[^}]*\}\s*from\s*['"]([^'"]+)['"]/);
  return { component: m?.[1] ?? null, from: m?.[2]?.split('/').pop() ?? null, index };
}

for (const pageRoot of PAGE_ROOTS) {
  const rootPath = at(pageRoot);
  if (!isDir(rootPath)) continue;

  for (const folder of readdirSync(rootPath)) {
    if (!folder.endsWith('Page')) continue; // skip Application/, LiveChat/, barrels, etc.
    const folderPath = join(rootPath, folder);
    if (!isDir(folderPath)) continue;

    const { component, from, index } = canonicalFromIndex(folderPath);

    // No index re-export of a *Page component -> can't resolve the chain.
    if (component == null) {
      add({
        page: folder,
        canonical: folder,
        rule: 'index-reexport',
        severity: 'safe',
        actual: index == null ? 'no index file' : 'no `export { XPage } from ...`',
        expected: `export { ${folder} } from './${folder}'`,
        files: [rel(folderPath)],
        fix: `add ${folder}/index.ts re-exporting the page component`,
      });
      continue;
    }

    const N = component; // canonical page name
    const componentFile = join(folderPath, `${N}.tsx`);

    // 1. folder name === canonical (SAFE)
    if (folder !== N) {
      add({
        page: folder,
        canonical: N,
        rule: 'folder-name',
        severity: 'safe',
        actual: folder,
        expected: N,
        files: [rel(folderPath)],
        fix: `rename folder ${folder}/ → ${N}/ and update importers`,
      });
    }

    // 2. main file === `${N}.tsx` (SAFE)
    if (!existsSync(componentFile)) {
      add({
        page: folder,
        canonical: N,
        rule: 'file-name',
        severity: 'safe',
        actual: `${N}.tsx missing (index points to ./${from})`,
        expected: `${N}.tsx`,
        files: [rel(folderPath)],
        fix: `rename the page file to ${N}.tsx`,
      });
    }

    const src = read(componentFile);

    // 3. component file exports a component named N (SAFE)
    if (src != null) {
      const exportsComponent = new RegExp(
        `export\\s+(?:const|function)\\s+${N}\\b` + // export const/function XPage
          `|export\\s+default\\s+(?:function\\s+)?${N}\\b` + // export default (function) XPage
          `|export\\s*\\{[^}]*\\b${N}\\b[^}]*\\}`, // export { XPage }
      ).test(src);
      if (!exportsComponent) {
        add({
          page: folder,
          canonical: N,
          rule: 'component-name',
          severity: 'safe',
          actual: `no exported component named ${N}`,
          expected: `export function ${N}(...)`,
          files: [rel(componentFile)],
          fix: `rename the page component to ${N}`,
        });
      }
    }

    // 4. public alias `N as AmityN` in src/index.ts (BREAKING)
    const expectedAlias = `Amity${N}`;
    const actualAlias = publicAliases.get(N);
    if (actualAlias == null) {
      // Not every page is a public entry point — internal sub-pages legitimately are
      // not re-exported. Flag as advisory so a human confirms intent, not breaking.
      add({
        page: folder,
        canonical: N,
        rule: 'public-export',
        severity: 'advisory',
        actual: 'not exported from src/index.ts',
        expected: `${N} as ${expectedAlias}`,
        files: ['src/index.ts'],
        fix: `if ${N} is a public entry point, add \`${N} as ${expectedAlias}\` to src/index.ts`,
      });
    } else if (actualAlias !== expectedAlias) {
      add({
        page: folder,
        canonical: N,
        rule: 'public-export',
        severity: 'breaking',
        actual: actualAlias,
        expected: expectedAlias,
        files: ['src/index.ts'],
        fix: `public alias ${actualAlias} disagrees with ${expectedAlias} — human decides the canonical name`,
      });
    }

    // 5. Page-level scaffolding contract: every page calls `useAmityPage({ pageId })` and
    //    wires its `accessibilityId` to the root `data-testid`. The pageId *value* is a
    //    cross-platform contract (shared with Flutter / iOS / Android) and is deliberately
    //    NOT validated here — only that a pageId is supplied at all.
    if (src != null) {
      const hasUseAmityPage = /useAmityPage\s*\(/.test(src);
      if (!hasUseAmityPage) {
        add({
          page: folder,
          canonical: N,
          rule: 'use-amity-page',
          severity: 'safe',
          actual: 'no useAmityPage(...) call at the page level',
          expected: 'const { accessibilityId, themeStyles } = useAmityPage({ pageId })',
          files: [rel(componentFile)],
          fix: `call useAmityPage({ pageId }) in ${N}`,
        });
      } else {
        if (!/useAmityPage\s*\(\s*\{[^}]*\bpageId\b/.test(src)) {
          add({
            page: folder,
            canonical: N,
            rule: 'page-id',
            severity: 'advisory',
            actual: 'useAmityPage called without a pageId',
            expected: 'useAmityPage({ pageId })',
            files: [rel(componentFile)],
            fix: `supply the page's cross-platform pageId (copy the other platforms' value — do not invent one)`,
          });
        }
        if (!/data-testid=\{\s*accessibilityId\s*\}/.test(src)) {
          add({
            page: folder,
            canonical: N,
            rule: 'accessibility-id',
            severity: 'safe',
            actual: 'accessibilityId is not wired to a data-testid',
            expected: 'data-testid={accessibilityId}',
            files: [rel(componentFile)],
            fix: `render ${N}'s root element with data-testid={accessibilityId}`,
          });
        }
      }
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
    console.log(`  • [${v.rule}] ${v.page}: ${v.actual}  →  ${v.expected}`);
    console.log(`      ${v.fix}`);
  }
}

console.log(
  `\n${violations.length === 0 ? '✅ pages: all naming checks pass' : `❌ pages: ${violations.length} violation(s) — ${bySeverity.safe.length} safe, ${bySeverity.breaking.length} breaking, ${bySeverity.advisory.length} advisory`}`,
);
process.exit(violations.length === 0 ? 0 : 1);
