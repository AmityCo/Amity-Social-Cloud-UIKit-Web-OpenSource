import {
  AMITY_API_METHOD_MODULE,
  AMITY_API_MODULE,
  AMITY_COMPONENT_MODULE,
  AMITY_ELEMENT_MODULE,
  AMITY_PAGE_MODULE,
} from '~/v4/core/providers/CustomizationProvider/moduleGraph';
import {
  isFeatureEnabled,
  isModuleExcluded,
  type Config,
} from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';
import {} from '~/v4/core/providers/CustomizationProvider/entitlement';
import { AMITY_UIKIT_FEATURES } from '~/v4/core/providers/CustomizationProvider/features';
import fullEntitlementJson from '~/v4/core/providers/CustomizationProvider/__tests__/fixtures/entitlement.full.json';

/**
 * One run per module revoked, measured rather than described.
 *
 * The report this feeds must not contain a number anyone typed. So the run
 * takes the shipped id tables and the shipped resolver, revokes one module in
 * core's answer, and records what came off — every page, component and element
 * the UIKit declares, and every SDK function a gate would refuse.
 *
 * Each id is scored twice, once against the customer's config and once against
 * core's grant, because the two are separate routes to the same blank screen
 * and a report that cannot tell them apart is not much use when one of them
 * breaks. Two columns per assertion, the way two viewports are two columns in
 * the browser run.
 *
 * What it cannot see: pixels and packets. A browser shows the screen really is
 * empty and a HAR that the requests really stopped; this proves what the code
 * decides, which is the layer a wrong decision starts in.
 *
 * Off unless it is told where to write, so a normal test run does not litter:
 *
 *   MODULE_GATE_MANIFEST_OUT=./manifest.json npx jest moduleGateManifest
 */

const OUT = process.env.MODULE_GATE_MANIFEST_OUT;

// Widened: these lists are compared against the id tables, which are keyed by
// plain strings — core owns the key space, not this union.
const MODULES: string[] = [...AMITY_UIKIT_FEATURES];

/** Every id the UIKit declares, by the segment it occupies in a config path. */
const SURFACES = [
  { kind: 'page' as const, table: AMITY_PAGE_MODULE, path: (id: string) => `${id}/*/*` },
  { kind: 'component' as const, table: AMITY_COMPONENT_MODULE, path: (id: string) => `*/${id}/*` },
  { kind: 'element' as const, table: AMITY_ELEMENT_MODULE, path: (id: string) => `*/*/${id}` },
];

/** Which SDK functions a module owns, repository-wide entries and leaves alike. */
const SDK_OWNERS: { name: string; owner: string }[] = [
  ...Object.entries(AMITY_API_MODULE).map(([stem, owner]) => ({
    name: `${stem}Repository.*`,
    owner,
  })),
  ...Object.entries(AMITY_API_METHOD_MODULE).map(([name, owner]) => ({ name, owner })),
].sort((a, b) => a.name.localeCompare(b.name));

/**
 * `enforce`, because that is the only mode in which a grant withholds anything.
 * Under `off` and `shadow` core still serves every module, and the gate follows
 * it — so a run built on the fixture's own `off` would revoke a module and
 * measure nothing being taken away.
 */
// The fixture is the decoded model, not the wire payload: `Client.getModuleSettings`
// owns the decode now, so nothing here parses it.
const fullEntitlement = fullEntitlementJson as unknown as Amity.ModuleSettings;

const revoke = (key: string): Amity.ModuleSettings => {
  const base = fullEntitlement;

  return { ...base, enforcement: 'enforce', modules: { ...base.modules, [key]: false } };
};

/** An evenly spread sample rather than the first n, so one crowded module does
 *  not fill the table and the rows stay the same between runs. */
const spread = <T>(items: T[], take: number): T[] => {
  if (items.length <= take) return items;
  const step = items.length / take;

  return Array.from({ length: take }, (_, i) => items[Math.floor(i * step)]);
};

type Verdict = 'pass' | 'fail' | 'vacuous';

interface AssertionRow {
  id: string;
  kind: string;
  owner: string;
  must: 'go' | 'remain';
  verdicts: { entitlement: Verdict };
}

interface SdkRow {
  name: string;
  owner: string;
  baseline: boolean;
  off: boolean;
  status: 'stopped' | 'leak' | 'unchanged' | 'gone-other';
}

describe('module gate · manifest', () => {
  const runs: Record<string, unknown>[] = [];

  it.each(MODULES)('measures the run with %s revoked', (switched) => {
    const entitlement = revoke(switched);
    const resolvesOff = MODULES.filter((key) => !isFeatureEnabled(key, entitlement));
    const resolvesOn = MODULES.filter((key) => isFeatureEnabled(key, entitlement));

    // Revoking a module must take it off. Anything else it takes with it is a
    // prerequisite rule, and that is what the report is for.
    expect(resolvesOff).toContain(switched);
    const surfaces = SURFACES.map(({ kind, table, path }) => {
      const ids = Object.keys(table);
      const gone = ids.filter((id) => isModuleExcluded(path(id), entitlement));
      // The counterpart assertion: an id owned by a module still on must stay.
      // Without it "everything disappeared" would read as a pass.
      const wrongly = gone.filter((id) => resolvesOn.includes(table[id]));

      expect(wrongly).toEqual([]);

      return { kind, total: ids.length, gone: gone.sort(), remain: ids.length - gone.length };
    });

    /** Score one id both ways. A source that cannot decide reads `vacuous`. */
    const score = (
      id: string,
      kind: string,
      owner: string,
      must: 'go' | 'remain',
    ): AssertionRow => {
      const { path } = SURFACES.find((s) => s.kind === kind)!;
      const held = (e: Amity.ModuleSettings | null) => isModuleExcluded(path(id), e);
      const verdict = (excluded: boolean): Verdict =>
        (must === 'go') === excluded ? 'pass' : 'fail';

      return {
        id,
        kind,
        owner,
        must,
        verdicts: {
          // One route now. The customer's own `features` block was the other,
          // and it is gone from `Config` — a module exists or it does not, and
          // only the plan says which.
          entitlement: verdict(held(entitlement)),
        },
      };
    };

    // Two or three ids per surface kind that must go, spread across the modules
    // the cascade took, plus one per kind that must remain — the row that makes
    // the table mean something.
    const rows: AssertionRow[] = [];

    SURFACES.forEach(({ kind, table, path }) => {
      const owned = Object.keys(table)
        .filter((id) => resolvesOff.includes(table[id]))
        .sort();
      const kept = Object.keys(table)
        .filter((id) => resolvesOn.includes(table[id]) && !isModuleExcluded(path(id), entitlement))
        .sort();

      spread(owned, 3).forEach((id) => rows.push(score(id, kind, table[id], 'go')));
      spread(kept, 1).forEach((id) => rows.push(score(id, kind, table[id], 'remain')));
    });

    // Every row must pass. The report shows them because a reader should see
    // which ids were checked, not because any of them is allowed to fail.
    expect(rows.filter((r) => Object.values(r.verdicts).includes('fail'))).toEqual([]);
    expect(rows.length).toBeGreaterThan(0);

    const sdk: SdkRow[] = SDK_OWNERS.map(({ name, owner }) => {
      const off = isFeatureEnabled(owner, entitlement);
      const owned = resolvesOff.includes(owner);

      return {
        name,
        owner,
        baseline: true,
        off,
        status: owned ? (off ? 'leak' : 'stopped') : off ? 'unchanged' : 'gone-other',
      };
    });

    // A leak is the gate not holding: the module is off and its calls still go.
    expect(sdk.filter((s) => s.status === 'leak')).toEqual([]);

    runs.push({
      switched,
      resolvesOff,
      resolvesOn,
      press: 'Nothing — the ids are read from the tables the build ships, not walked.',
      surfaces,
      assertions: { rows },
      sdk: {
        rows: sdk,
        total: sdk.length,
        stopped: sdk.filter((s) => s.status === 'stopped').length,
        leak: 0,
        gated: sdk.filter((s) => s.status === 'stopped').map((s) => s.name),
      },
    });
  });

  it('writes the manifest', () => {
    // Sorted by blast radius: the modules that take the most with them first,
    // which is the order the question "what does switching this off cost" is
    // usually asked in.
    runs.sort(
      (a, b) =>
        (b.resolvesOff as string[]).length - (a.resolvesOff as string[]).length ||
        (a.switched as string).localeCompare(b.switched as string),
    );

    const manifest = {
      generatedAt: new Date().toISOString(),
      source: 'code' as const,
      modules: MODULES,
      surfaceTotals: SURFACES.map(({ kind, table }) => ({
        kind,
        total: Object.keys(table).length,
      })),
      sdkTotal: SDK_OWNERS.length,
      runs,
    };

    expect(manifest.runs).toHaveLength(MODULES.length);

    if (!OUT) {
      console.log('MODULE_GATE_MANIFEST_OUT is unset — measured but not written.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('fs');
    fs.writeFileSync(OUT, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`manifest written to ${OUT}: ${manifest.runs.length} runs`);
  });
});
