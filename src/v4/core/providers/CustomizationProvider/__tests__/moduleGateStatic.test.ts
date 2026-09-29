import fs from 'fs';
import path from 'path';

/**
 * The two module-gate rules a runtime test cannot reach.
 *
 * Both are ratchets: the violations that exist today are frozen in the
 * baseline, and the check fails on anything new. Fixing one means deleting its
 * line from the baseline, which is the point — the file is the to-do list.
 */

/**
 * Two module-gate rules that only a source scan can prove.
 *
 * Both come from the spec's "Rules for new code" and both are invisible to a
 * runtime test, because the failure needs a config the test does not have:
 *
 *  - Rule 6 / React: a hook below `if (isExcluded) return null` renders fewer
 *    hooks on the render where the flag turns true. `CustomizationProvider`
 *    defuses it by remounting on a features change, so nothing crashes today —
 *    which is exactly why a new one lands unnoticed. The provider is the only
 *    thing holding it, and the provider is one refactor from not holding it.
 *
 *  - Rule 8 / R6: a repository read called straight out of `useEffect` or
 *    `useCallback` never meets the fetcher gate, so a switched-off module still
 *    asks. `useSdkEffect` and the live hooks resolve the owner from the fetcher;
 *    a bare call resolves nothing.
 *
 * Both are ratchets rather than assertions. The existing violations are frozen
 * in `moduleGateStatic.baseline.json`; the check fails on anything not in it.
 * A clean assertion would fail on commit one and be switched off by commit two.
 */

interface GateViolation {
  file: string;
  detail: string;
}

const SRC = 'src/v4';

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__tests__' && entry.name !== '__mocks__') walk(full, out);
    } else if (/\.tsx?$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
};

const sources = (root: string) =>
  walk(path.join(root, SRC)).map((file) => ({
    file: path.relative(root, file).split(path.sep).join('/'),
    text: fs.readFileSync(file, 'utf8'),
  }));

/** A hook call sitting below an `if (isExcluded) return` in the same function. */
const hooksBelowGate = (root: string): GateViolation[] => {
  const out: GateViolation[] = [];

  for (const { file, text } of sources(root)) {
    const lines = text.split('\n');

    lines.forEach((line, index) => {
      if (!/if\s*\(\s*isExcluded\s*\)\s*return/.test(line)) return;

      for (let i = index + 1; i < lines.length; i += 1) {
        // A top-level `}` ends the component the gate belongs to.
        if (/^\}/.test(lines[i])) return;

        // The generic argument list has to be optional here: `useRef<T>(null)`
        // is a hook and `use[A-Z]\w+\s*\(` does not match it, so the scan
        // walked past every typed hook and reported the next plain one.
        const hook = lines[i].match(/\b(use[A-Z]\w+)\s*(?:<[^;()]*>)?\s*\(/);
        // useCallback and useMemo take the same position but hold no state of
        // their own; React counts them, so they are violations too — they are
        // reported separately only because they are cheaper to move.
        if (hook) {
          out.push({ file, detail: `${hook[1]} below the gate` });
          return;
        }
      }
    });
  }

  return out;
};

/** Repository names the module tables own, so a read on them is gateable. */
const OWNED_READ =
  /\b((?:Ad|Category|Channel|Comment|Community|Event|EventCalendar|Feed|Invitation|LiveReaction|Message|Poll|Post|Product|Reaction|Room|RoomPresence|Story|Stream|SubChannel)Repository)\.((?:get|query|search)[A-Za-z]*)/g;

/**
 * A read on an owned repository in a file that never routes through the gate.
 *
 * `useSdkEffect` and the live hooks both take the sdk function and resolve its
 * owner, so a file that hands the fetcher to either is fine however it reads.
 * A file that names neither is calling the repository itself.
 */
const ungatedRepositoryReads = (root: string): GateViolation[] => {
  const out: GateViolation[] = [];

  for (const { file, text } of sources(root)) {
    if (/useSdkEffect|useLiveCollection|useLiveObject/.test(text)) continue;
    if (!/useEffect|useCallback/.test(text)) continue;

    const found = new Set<string>();
    for (const match of text.matchAll(OWNED_READ)) found.add(`${match[1]}.${match[2]}`);

    [...found].sort().forEach((call) => out.push({ file, detail: call }));
  }

  return out;
};

const asKeys = (violations: GateViolation[]): string[] =>
  violations.map((v) => `${v.file} :: ${v.detail}`).sort();

const ROOT = path.resolve(__dirname, '../../../../../..');
const BASELINE = path.join(__dirname, 'moduleGateStatic.baseline.json');

const found = {
  hooksBelowGate: asKeys(hooksBelowGate(ROOT)),
  ungatedRepositoryReads: asKeys(ungatedRepositoryReads(ROOT)),
};

// Fixing a violation means deleting its line from the baseline. Regenerate with
// `UPDATE_MODULE_GATE_BASELINE=1 pnpm test moduleGateStatic` and read the diff:
// lines leaving are debt paid, lines arriving are debt taken on.
if (process.env.UPDATE_MODULE_GATE_BASELINE) {
  fs.writeFileSync(BASELINE, `${JSON.stringify(found, null, 2)}\n`);
}

const baseline: { hooksBelowGate: string[]; ungatedRepositoryReads: string[] } = JSON.parse(
  fs.readFileSync(BASELINE, 'utf8'),
);

const diff = (found: string[], allowed: string[]) => ({
  added: found.filter((key) => !allowed.includes(key)),
  fixed: allowed.filter((key) => !found.includes(key)),
});

describe('module gate — static rules', () => {
  it('adds no new hook below an isExcluded gate', () => {
    const { added } = diff(found.hooksBelowGate, baseline.hooksBelowGate);

    // A hook under the gate renders fewer hooks the moment the flag turns
    // true. Nothing crashes today only because CustomizationProvider remounts
    // the tree on a features change; move the gate above the hooks instead of
    // relying on that.
    expect(added).toEqual([]);
  });

  it('adds no repository read that bypasses the fetcher gate', () => {
    const { added } = diff(found.ungatedRepositoryReads, baseline.ungatedRepositoryReads);

    // R6: a module that is off must not ask. A read called straight out of
    // useEffect never meets the gate — route it through useSdkEffect, which
    // takes the sdk function and resolves its owner.
    expect(added).toEqual([]);
  });

  it('keeps the baseline honest — a fixed violation must leave the baseline', () => {
    const hooks = diff(found.hooksBelowGate, baseline.hooksBelowGate);
    const reads = diff(found.ungatedRepositoryReads, baseline.ungatedRepositoryReads);

    // A stale entry means the baseline is claiming debt that is already paid,
    // and the next real violation hides behind it.
    expect({ hooks: hooks.fixed, reads: reads.fixed }).toEqual({ hooks: [], reads: [] });
  });
});
