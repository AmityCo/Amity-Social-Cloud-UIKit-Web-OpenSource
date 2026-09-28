import { AMITY_UIKIT_FEATURES } from '~/v4/core/providers/CustomizationProvider/features';
import { isFeatureEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';
import { ENTITLEMENT_MODULES_PATH } from '~/v4/core/providers/CustomizationProvider/entitlement';

/**
 * Does core actually answer, and does its answer mean what this build thinks?
 *
 * The rest of the suite fixes the client's behaviour against the documented
 * contract. It cannot tell anyone whether the endpoint is deployed on their
 * region, whether the 18 catalog keys are spelled the way the UIKit spells
 * them, or which modules a given network bought — and those are the three
 * things that decide what a customer sees. This asks core.
 *
 * Off by default: it needs a network and a session, so it skips unless it is
 * given one. Three ways in, cheapest first:
 *
 *   # 1. From a response someone already has — curl, Postman, devtools.
 *   #    Nothing secret goes near the runner this way.
 *   AMITY_VERIFY_FILE=./modules-response.json npx jest moduleEntitlementLive
 *
 *   # 2. With a session token already in hand. Needs no SDK, so it works
 *   #    wherever `fetch` does.
 *   AMITY_VERIFY_ENDPOINT=https://apix.staging.amity.co AMITY_VERIFY_TOKEN=… \
 *     npx jest moduleEntitlementLive
 *
 *   # 3. Live — logs in with the SDK exactly as the UIKit does.
 *   AMITY_VERIFY_API_KEY=… AMITY_VERIFY_USER_ID=… \
 *     AMITY_VERIFY_REGION=staging AMITY_VERIFY_ENDPOINT=https://apix.staging.amity.co \
 *     npx jest moduleEntitlementLive
 *
 * `AMITY_VERIFY_REGION` defaults to `sg`, and `AMITY_VERIFY_ENDPOINT` overrides
 * the host that region implies — a staging network needs both. Reading the
 * report matters more than the pass: a green run against a network that bought
 * everything proves the endpoint works, not that the gating does.
 */

const {
  AMITY_VERIFY_API_KEY,
  AMITY_VERIFY_REGION,
  AMITY_VERIFY_USER_ID,
  AMITY_VERIFY_FILE,
  AMITY_VERIFY_ENDPOINT,
  AMITY_VERIFY_TOKEN,
} = process.env;

const canRun = Boolean(AMITY_VERIFY_API_KEY || AMITY_VERIFY_FILE || AMITY_VERIFY_TOKEN);

/** The keys this build knows how to gate on. */
const UIKIT_MODULES: string[] = [...AMITY_UIKIT_FEATURES];

/**
 * The wire payload as the model, for the two paths that never touch the SDK.
 *
 * Production has no decoder: `Client.getModuleSettings` owns it. This one
 * exists because a file dump and a bare `fetch` have no SDK between them and
 * the JSON, and it does the one thing that mapping is — `mode` is the wire's
 * name for `enforcement`. It deliberately validates nothing else, so a payload
 * core sends in a shape this build does not expect shows up as a failing
 * assertion below rather than being tidied away here.
 */
const decode = (raw: unknown): Amity.ModuleSettings => {
  const { mode, enforcement, modules, catalog } = (raw ?? {}) as Record<string, unknown>;

  return {
    enforcement: (enforcement ?? mode) as Amity.ModuleEnforcementMode,
    modules: (modules ?? {}) as Amity.ModuleSettings['modules'],
    catalog: (catalog ?? {}) as Amity.ModuleSettings['catalog'],
  };
};

/** Imported inside the test, not at the top: the SDK is a peer dependency and
 *  a heavy one, and a suite that skips must not pay to load it. */
const readLive = async (): Promise<unknown> => {
  const { Client } = await import('@amityco/ts-sdk');

  const client = Client.createClient(AMITY_VERIFY_API_KEY as string, AMITY_VERIFY_REGION ?? 'sg', {
    // A region string alone does not reach a staging network.
    apiEndpoint: AMITY_VERIFY_ENDPOINT ? { http: AMITY_VERIFY_ENDPOINT } : undefined,
  });

  await Client.login(
    { userId: AMITY_VERIFY_USER_ID as string },
    { sessionWillRenewAccessToken: (renewal) => renewal.renew() },
  );

  const response = await client.http.get(ENTITLEMENT_MODULES_PATH);

  return response?.data;
};

/**
 * The same read with a token already in hand.
 *
 * The SDK is the truest client, but it is also a browser-shaped dependency and
 * a login round trip; someone who already has a session token should not need
 * either to find out whether core answers.
 */
const readWithToken = async (): Promise<unknown> => {
  const base = (AMITY_VERIFY_ENDPOINT ?? '').replace(/\/$/, '');

  if (!base) throw new Error('AMITY_VERIFY_TOKEN needs AMITY_VERIFY_ENDPOINT beside it');

  const response = await fetch(`${base}${ENTITLEMENT_MODULES_PATH}`, {
    headers: { Authorization: `Bearer ${AMITY_VERIFY_TOKEN}` },
  });

  // Reported, not thrown: a 404 says the endpoint is not deployed on this
  // network and a 401 says the token is wrong, and telling those apart is the
  // reason anyone runs this.
  console.log(`HTTP ${response.status} ${response.statusText} from ${base}`);

  return response.json().catch(() => null);
};

const readFile = async (): Promise<unknown> => {
  const fs = await import('fs');

  return JSON.parse(fs.readFileSync(AMITY_VERIFY_FILE as string, 'utf8'));
};

(canRun ? describe : describe.skip)('module entitlement · against core', () => {
  let raw: unknown;

  beforeAll(async () => {
    if (AMITY_VERIFY_FILE) raw = await readFile();
    else if (AMITY_VERIFY_TOKEN) raw = await readWithToken();
    else raw = await readLive();
  }, 60_000);

  it('answers the read', () => {
    console.log(`\n${ENTITLEMENT_MODULES_PATH} answered:\n${JSON.stringify(raw, null, 2)}\n`);

    expect(raw).toBeTruthy();
    expect(typeof raw).toBe('object');
  });

  it('answers in the documented shape', () => {
    const entitlement = decode(raw);

    expect(raw).toBeTruthy();
    expect(['off', 'shadow', 'enforce']).toContain((raw as Record<string, unknown>).mode);
    expect(typeof (raw as Record<string, unknown>).modules).toBe('object');

    // A network with no record answers { mode: "off", modules: {} } — real, and
    // worth naming rather than reading as a broken response.
    if (Object.keys(entitlement.modules).length === 0) {
      console.log('This network has no entitlement record: nothing bought, nothing gated.');
    }

    Object.entries(entitlement.catalog).forEach(([key, definition]) => {
      expect(Array.isArray(definition!.requires)).toBe(true);
      expect(['api', 'setting']).toContain(definition!.kind);
      expect(typeof key).toBe('string');
    });
  });

  it('speaks the same module names as this build', () => {
    const entitlement = decode(raw);
    const answered = new Set([
      ...Object.keys(entitlement.catalog),
      ...Object.keys(entitlement.modules),
    ]);

    // Already translated into the UIKit's key space, so anything still unmatched
    // is a module this build has no gate for — core will refuse it and the UI
    // will keep offering it.
    const unknownToUiKit = [...answered].filter((key) => !UIKIT_MODULES.includes(key));
    // The other direction: a UIKit module core never mentioned reads as granted,
    // which is right if core does not sell it and wrong if it is spelled
    // differently than the translation expects.
    const unanswered = UIKIT_MODULES.filter((key) => !answered.has(key));
    // A prerequisite pointing at a key nothing answered for resolves through the
    // generated graph instead, which is a silent fallback worth seeing.
    const danglingRequires = Object.entries(entitlement.catalog).flatMap(([key, definition]) =>
      (definition?.requires ?? [])
        .filter((dep) => !answered.has(dep))
        .map((dep) => `${key} → ${dep}`),
    );

    console.log(
      [
        `mode: ${entitlement.enforcement}`,
        `core answered for ${answered.size} modules; this build gates ${UIKIT_MODULES.length}`,
        `not gated by this build: ${unknownToUiKit.join(', ') || '—'}`,
        `not answered for by core: ${unanswered.join(', ') || '—'}`,
        `requires pointing nowhere: ${danglingRequires.join(', ') || '—'}`,
      ].join('\n'),
    );

    // Reported, not asserted: core carries settings-only modules the UIKit has
    // no surface for, and the UIKit may ship a module a plan does not sell yet.
    // Neither is a failure — an unread report is.
    expect(answered.size).toBeGreaterThan(0);
  });

  it('carries a rule for every module this build gates', () => {
    const entitlement = decode(raw);

    // The catalog is the only source of the bundle rules now, so a module this
    // build gates and core does not carry resolves on its own flag with nothing
    // cascading. Printed as well as asserted: the rules are the network's, and
    // reading what this network actually sells is half of why this test exists.
    const rules = UIKIT_MODULES.map((key) => {
      const definition = entitlement.catalog[key];
      const requires = definition ? definition.requires.join(' or ') || '—' : 'NOT CARRIED';

      return `${key.padEnd(20)} needs ${requires}`;
    });

    console.log(`\nWhat core says the bundle rules are:\n${rules.join('\n')}\n`);

    const missing = UIKIT_MODULES.filter((key) => !(key in entitlement.catalog));

    expect(missing).toEqual([]);
  });

  it('resolves every module the way the UIKit will', () => {
    const entitlement = decode(raw);

    const rows = UIKIT_MODULES.map((key) => {
      const granted = entitlement.modules[key];
      const resolved = isFeatureEnabled(key, entitlement);
      const grant = granted === undefined ? 'unanswered' : String(granted);
      // Granted on its own but off after the bundle rules means a prerequisite
      // took it down — the one outcome that surprises people.
      const note = granted === true && !resolved ? '  ← held off by a prerequisite' : '';

      return `${key.padEnd(20)} grant=${grant.padEnd(10)} ui=${resolved ? 'on' : 'off'}${note}`;
    });

    console.log(`\nWhat the UIKit does with this answer:\n${rows.join('\n')}\n`);

    expect(rows).toHaveLength(UIKIT_MODULES.length);
  });
});
