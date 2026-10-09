/**
 * What the network bought, read from core rather than inferred from a plan.
 *
 * `GET /api/v3/network-settings/modules` answers with the grants, the
 * enforcement mode and the whole catalog in one read. It sits in the base layer,
 * so it answers even when every module is revoked — which is the point: a client
 * can always discover why a feature disappeared.
 *
 * The shape is the SDK's `Amity.ModuleSettings`, taken as it arrives. There was
 * a parser here, and every rule it enforced — an unknown mode reading as `off`,
 * only a literal `true` counting as a grant, a catalog entry defaulting its
 * label to its key — is `parseModuleSettings` inside the SDK, line for line,
 * under REQ-001/REQ-002 of `AmityModuleEnforcementMode`. Two copies of one
 * decoder is one copy too many: the wire field is `mode` and the model's is
 * `enforcement`, and the copy that fell behind on a rename would have read the
 * mode as absent and gated nothing while looking like it worked.
 *
 * So the only shape rule left here is the one that is the UIKit's: what a
 * *missing* answer means. `null` is core not answering — an older core, a
 * network error, a host that never fetched — and it grants everything.
 */

/** The raw endpoint, for the live check in `__tests__`. Production reads it
 *  through `Client.getModuleSettings()`, which owns the request and the decode. */
export const ENTITLEMENT_MODULES_PATH = '/api/v3/network-settings/modules';

/**
 * Whether core will actually refuse a revoked module's endpoints.
 *
 * This is the gate, not a report. A grant only withholds a module where core
 * would refuse the call: allowed at `off`, allowed and logged at `shadow`,
 * refused with 403 / 400325 at `enforce`. `shadow` resolving identically to
 * `off` is the documented rule and not an oversight — it is a dry run, and
 * withholding a module during the period meant to warn about losing it would
 * take the feature away early.
 */
export const isEntitlementEnforced = (entitlement?: Amity.ModuleSettings | null): boolean =>
  entitlement?.enforcement === 'enforce';

/**
 * Whether this module is granted.
 *
 * The mode decides first, and only `enforce` withholds anything. Under `off`
 * and `shadow` core still serves every module whatever the grants say, so a
 * client that hid one would be withholding a working feature on its own
 * authority — and today every network reads `off`, which is why this is not a
 * corner case. Confirmed against the ops panel that sets the mode: a module
 * counts as denied only under `enforce`.
 *
 * Under `enforce` the documented rule applies as it comes: `modules` may be
 * partial and an absent key is not granted, so a network in that mode with no
 * grants has nothing.
 *
 * Two things are still not core saying "not bought", and neither hides
 * anything: no entitlement at all — an older core, a network error, a host
 * that never fetched — and a module core has never heard of. The catalog is
 * complete, so a key absent from it means core does not gate that module and
 * the UIKit must not invent a grant to withhold; `clip` is the live example.
 * `modules` counts as knowing too: a response that names a module without a
 * catalog entry has still answered for it, and reading only the catalog there
 * would let a revoked module through.
 *
 * This is the leaf predicate the SDK's own `resolveModuleAvailability` uses, so
 * the two agree on a module in isolation. What the UIKit adds around it is the
 * customer's `config.json` and one walk over both sources.
 */
export const isModuleGranted = (
  key: string,
  entitlement?: Amity.ModuleSettings | null,
): boolean => {
  if (!entitlement) return true;
  if (!isEntitlementEnforced(entitlement)) return true;
  if (!(key in entitlement.catalog) && !(key in entitlement.modules)) return true;

  return entitlement.modules[key] === true;
};

/**
 * The prerequisites for a module, as core reports them.
 *
 * `catalog[k].requires` is OR: `comment` requires `["post", "story"]` and
 * either one satisfies it. Reading it as AND would wrongly hide Comment from a
 * story-only network. There is one list and one meaning, which is the point of
 * taking it from core rather than keeping a second copy: the copy this replaced
 * carried both an AND list and an OR list under the names `all` and `any`, and
 * `requires` mapped onto whichever name a reader assumed.
 *
 * Empty for a module core does not carry, and for every module when core has
 * not answered at all — no prerequisites to check, so nothing cascades. That is
 * the honest answer rather than a guess: the rules are the network's, and a
 * client that invented them would be hiding a feature on its own authority.
 */
export const requirementOf = (
  key: string,
  entitlement?: Amity.ModuleSettings | null,
): readonly string[] => entitlement?.catalog[key]?.requires ?? [];

/**
 * What a remount has to key on.
 *
 * `CustomizationProvider` remounts when the set of switched-off modules
 * changes, because `isExcluded` flipping under a component that has already run
 * its hooks is React #300. The entitlement arrives from the network, so it is a
 * second source of exactly that flip and belongs in the same key.
 */
export const entitlementKey = (entitlement?: Amity.ModuleSettings | null): string =>
  entitlement ? `${entitlement.enforcement}:${JSON.stringify(entitlement.modules)}` : '';
