import { AMITY_UIKIT_FEATURES } from '~/v4/core/providers/CustomizationProvider/features';
import {
  isFeatureEnabled,
  isModuleExcluded,
} from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';
import fullEntitlementJson from '~/v4/core/providers/CustomizationProvider/__tests__/fixtures/entitlement.full.json';
import {
  isEntitlementEnforced,
  isModuleGranted,
  requirementOf,
} from '~/v4/core/providers/CustomizationProvider/entitlement';

// The fixture is the decoded model, not the wire payload: `Client.getModuleSettings`
// owns the decode now, so nothing here parses it.
const fullEntitlement = fullEntitlementJson as unknown as Amity.ModuleSettings;

/**
 * The entitlement read: core's grants, under the mode that makes them bite.
 *
 * A grant withholds a module only where core would refuse the call — `enforce`.
 * Under `off` and `shadow` core serves everything whatever the grants say, and
 * a client hiding a module there would be withholding a working feature on its
 * own authority. So these fix the three things that decide what a customer
 * sees: the mode, the grants, and `requires`, which is OR and would wrongly
 * hide Comment from a story-only network if it were read as AND.
 */

const CATALOG: Amity.ModuleSettings['catalog'] = {
  community: { label: 'Community', kind: 'api', requires: [] },
  chat: { label: 'Chat', kind: 'api', requires: [] },
  story: { label: 'Story', kind: 'api', requires: ['community'] },
  post: { label: 'Post', kind: 'api', requires: ['community'] },
  comment: { label: 'Comment', kind: 'api', requires: ['post', 'story'] },
  feed: { label: 'Feed', kind: 'api', requires: ['post'] },
  userRelationship: { label: 'User Relationship', kind: 'api', requires: [] },
  aiModeration: { label: 'AI Moderation', kind: 'setting', requires: [] },
};

const entitlement = (
  enforcement: Amity.ModuleSettings['enforcement'],
  modules: Record<string, boolean>,
): Amity.ModuleSettings => ({ enforcement, modules, catalog: CATALOG });

describe('module entitlement', () => {
  it('leaves every module on when there is no entitlement to read', () => {
    // An older core, a network error, a host that never fetched: the behaviour
    // the UIKit had before this read existed.
    expect(isFeatureEnabled('chat', null)).toBe(true);
    expect(isFeatureEnabled('chat', undefined)).toBe(true);
    expect(isModuleExcluded('chat_page/*/*', null)).toBe(false);
  });

  it('withholds a revoked module under enforce, and only under enforce', () => {
    // `off` and `shadow` still serve the module, so hiding it would take a
    // working feature away from a customer on this build's own authority.
    const revoked = { community: true, chat: false };

    expect(isFeatureEnabled('chat', entitlement('enforce', revoked))).toBe(false);
    expect(isFeatureEnabled('chat', entitlement('off', revoked))).toBe(true);
    expect(isFeatureEnabled('chat', entitlement('shadow', revoked))).toBe(true);
    expect(isFeatureEnabled('community', entitlement('enforce', revoked))).toBe(true);
  });

  it('reads an unknown mode as the one that claims the least', () => {
    expect(isEntitlementEnforced(entitlement('enforce', {}))).toBe(true);
    expect(isEntitlementEnforced(entitlement('shadow', {}))).toBe(false);
    expect(isEntitlementEnforced(null)).toBe(false);
  });

  it('leaves every module on for the answer every network gives today', () => {
    // A network with no record answers 200 with { mode: "off", modules: {} },
    // and the catalog still arrives complete because the catalog is the same
    // for everyone. Every module core knows about is in it and none of them is
    // in `modules` — so a gate that read the grants without the mode would find
    // eighteen keys "not granted" and empty the app, on every network in
    // existence. The mode is what stops that.
    const fresh = entitlement('off', {});

    expect(isFeatureEnabled('chat', fresh)).toBe(true);
    expect(isFeatureEnabled('community', fresh)).toBe(true);
    expect(isFeatureEnabled('comment', fresh)).toBe(true);
    expect(isModuleExcluded('chat_page/*/*', fresh)).toBe(false);
    expect(isModuleExcluded('community_profile_page/*/*', fresh)).toBe(false);
  });

  it('applies the partial-grant rule once enforcement is on', () => {
    // Under enforce the documented rule applies as it comes: `modules` may be
    // partial, and an absent key is not granted. The same payload under `off`
    // withholds nothing, which is the pair that matters — one named grant does
    // not turn a permissive network into a restrictive one.
    const partial = entitlement('enforce', { community: true });

    expect(isFeatureEnabled('community', partial)).toBe(true);
    expect(isFeatureEnabled('chat', partial)).toBe(false);
    expect(isFeatureEnabled('chat', { ...partial, enforcement: 'off' })).toBe(true);
  });

  it('reads an absent key as not granted', () => {
    // `modules` may be partial. Only the modules core carries are gated: a key
    // absent from the catalog is not an entitlement question at all.
    const partial = entitlement('enforce', { community: true, post: true, feed: true });

    expect(isModuleGranted('community', partial)).toBe(true);
    expect(isModuleGranted('chat', partial)).toBe(false);
    // Not in the catalog above, so core does not gate it.
    expect(isModuleGranted('poll', partial)).toBe(true);
    expect(isFeatureEnabled('poll', partial)).toBe(true);
  });

  it('satisfies a prerequisite with any one entry, not all of them', () => {
    // comment requires ["post", "story"] — a story-only network keeps Comment.
    const storyOnly = entitlement('enforce', {
      community: true,
      story: true,
      comment: true,
      post: false,
    });

    expect(isFeatureEnabled('comment', storyOnly)).toBe(true);
    expect(isFeatureEnabled('post', storyOnly)).toBe(false);
  });

  it('hides a module once every prerequisite core lists for it is hidden', () => {
    // The relationship read straight off the catalog: comment requires
    // ["post", "story"], so revoking one leaves it standing and revoking both
    // takes it down. Nothing here consults the generated graph.
    const grants = { community: true, comment: true, feed: true, chat: true };

    expect(
      isFeatureEnabled('comment', entitlement('enforce', { ...grants, post: true, story: false })),
    ).toBe(true);
    expect(
      isFeatureEnabled('comment', entitlement('enforce', { ...grants, post: false, story: true })),
    ).toBe(true);
    expect(
      isFeatureEnabled('comment', entitlement('enforce', { ...grants, post: false, story: false })),
    ).toBe(false);
  });

  it('cascades on the resolved prerequisite, not on the raw grant', () => {
    // The relationship is between resolved modules. Comment needs Post or
    // Story; a Story that is granted but held off by its own prerequisite is
    // not a Story that can satisfy Comment, and reading the grants alone would
    // say otherwise.
    const storyGrantedButCommunityRevoked = entitlement('enforce', {
      community: false,
      post: false,
      story: true,
      comment: true,
    });

    expect(isFeatureEnabled('story', storyGrantedButCommunityRevoked)).toBe(false);
    expect(isFeatureEnabled('comment', storyGrantedButCommunityRevoked)).toBe(false);
  });

  it('takes dependents down with a revoked dependency', () => {
    const noCommunity = entitlement('enforce', {
      community: false,
      post: true,
      feed: true,
      chat: true,
      comment: true,
    });

    // Granted, every one of them, and off anyway: feed -> post -> community.
    expect(isFeatureEnabled('post', noCommunity)).toBe(false);
    expect(isFeatureEnabled('feed', noCommunity)).toBe(false);
    // comment needs post or story, and community took both.
    expect(isFeatureEnabled('comment', noCommunity)).toBe(false);
    // chat sells alone.
    expect(isFeatureEnabled('chat', noCommunity)).toBe(true);
    // The clip feed page has no module of its own — it is Feed's, and it goes
    // down the same chain as everything else Feed owns.
    expect(isModuleExcluded('clip_feed_page/*/*', noCommunity)).toBe(true);
    expect(isModuleExcluded('chat_page/*/*', noCommunity)).toBe(false);
  });

  it('follows the catalog when it sells a module the bundles usually gate', () => {
    // Every other network sells Feed with Post. Core is the authority on that,
    // not this build — the catalog ships in the same response precisely so a
    // client does not carry its own copy of the bundle rules. There was a copy
    // here, generated, and it said Feed needs Post; on this network it would
    // have hidden a Feed the customer is paying for, for want of a Post they
    // were never sold.
    const soldAlone = {
      enforcement: 'enforce' as const,
      modules: { feed: true, post: false, community: false },
      catalog: { ...CATALOG, feed: { label: 'Feed', kind: 'api' as const, requires: [] } },
    };

    expect(requirementOf('feed', soldAlone)).toEqual([]);
    expect(isFeatureEnabled('feed', soldAlone)).toBe(true);
    // The same build, the same module, on a network core gates the usual way.
    expect(isFeatureEnabled('feed', entitlement('enforce', { feed: true, post: false }))).toBe(
      false,
    );
  });

  it('has no prerequisites for a module core does not carry, and none when core is silent', () => {
    // Both are core not answering, and neither is core saying "not bought", so
    // neither hides anything: a module absent from the catalog resolves on its
    // own flag, and so does every module when there is no entitlement at all.
    //
    // This is the one thing that changed when the generated graph went. The
    // graph was the bundle rules before this read existed, and it answered
    // whether or not core had. Now the rules are the network's, so a customer
    // whose config file switches Community off no longer loses Post with it
    // while core is unreachable — the cascade returns with the response. Under
    // every mode core actually sends, including the `off` every network reads
    // today, the catalog is there and the cascade holds; the exposed case is a
    // failed read or a core too old to answer.
    expect(requirementOf('poll', entitlement('enforce', {}))).toEqual([]);
    expect(isFeatureEnabled('poll', entitlement('enforce', { poll: true }))).toBe(true);

    expect(requirementOf('post', null)).toEqual([]);
    // Nothing is left to withhold anything: no plan, no cascade, every module
    // on. That is the pre-entitlement behaviour, and it is the safe direction —
    // a read that failed must not hide a feature the customer is paying for.
    expect(isFeatureEnabled('post', null)).toBe(true);
    expect(isFeatureEnabled('community', null)).toBe(true);
  });

  it('gates every module core sells an API surface for', () => {
    // The other direction, and the one that catches a module core adds: this
    // build must carry a switch for everything the catalog sells with an
    // endpoint. The three `kind: setting` modules gate a Console write and own
    // no UIKit surface, so they are not switches.
    //
    // Lived in the flags panel's own suite, which went with the panel. The
    // drift it catches was never the panel's — it is between the generated
    // feature union and core — so the case outlives both.
    const sold = Object.entries(fullEntitlement.catalog)
      .filter(([, definition]) => definition?.kind === 'api')
      .map(([key]) => key);

    expect(sold.filter((key) => !AMITY_UIKIT_FEATURES.includes(key as never))).toEqual([]);
    expect(sold).toHaveLength(AMITY_UIKIT_FEATURES.length);
  });

  it('is answered for by core for every module this build gates', () => {
    // Load-bearing now that the catalog is the only source of the bundle
    // rules: a module this build gates and core does not carry has no rules at
    // all, and would resolve on its own flag alone. That is a silent path — it
    // hides nothing and fails nothing — so the day core stops carrying one, it
    // has to fail here.
    const carried = fullEntitlement.catalog;

    expect(AMITY_UIKIT_FEATURES.filter((key) => !(key in carried))).toEqual([]);
  });

  it('is the only thing that can withhold a module', () => {
    // There was a second source here — a `features` block in the customer's own
    // config, which could switch off something they had bought. It is gone, so
    // a granted module is on and a revoked one is off, with nothing local left
    // to disagree.
    expect(isFeatureEnabled('chat', entitlement('enforce', { chat: true }))).toBe(true);
    expect(isFeatureEnabled('chat', entitlement('enforce', { chat: false }))).toBe(false);
  });
});

describe('the full-catalog fixture', () => {
  /**
   * A stand-in for the response core will send once the catalog is confirmed,
   * so a plan can be tried before it exists — pass it to `AmityUIKitProvider`
   * as `entitlement`, or to the live verifier as `AMITY_VERIFY_FILE`.
   *
   * Checked here rather than left as a loose file: a fixture that drifts from
   * the modules this build gates is worse than none, because it looks like
   * coverage. These cases fail the day the two stop matching.
   */
  const entitlement = fullEntitlement;

  it('carries every module this build gates', () => {
    AMITY_UIKIT_FEATURES.forEach((key) => {
      expect(entitlement.catalog[key]).toBeDefined();
      expect(entitlement.modules[key]).toBe(true);
    });
  });

  it('leaves everything on, so a flipped grant is the only thing under test', () => {
    AMITY_UIKIT_FEATURES.forEach((key) => {
      expect(isFeatureEnabled(key, entitlement)).toBe(true);
    });
  });

  it('hides the dependents of a grant flipped off in it', () => {
    // What the fixture is for: one edit, and the cascade is visible. Under
    // `enforce`, because that is the only mode in which flipping a grant off
    // takes anything away — the fixture's own mode is `off`, which is what
    // every network reads today.
    const noCommunity = {
      ...entitlement,
      enforcement: 'enforce' as const,
      modules: { ...entitlement.modules, community: false },
    };

    expect(isFeatureEnabled('community', noCommunity)).toBe(false);
    expect(isFeatureEnabled('post', noCommunity)).toBe(false);
    expect(isFeatureEnabled('feed', noCommunity)).toBe(false);
    expect(isFeatureEnabled('comment', noCommunity)).toBe(false);
    expect(isFeatureEnabled('chat', noCommunity)).toBe(true);
  });
});

describe('the answer as it arrives', () => {
  /**
   * These used to run the payload through a parser of the UIKit's own. It is
   * gone: `Client.getModuleSettings` decodes, and the SDK's rules — an unknown
   * mode reading as `off`, only a literal `true` counting as a grant, a catalog
   * key this build predates surviving — are REQ-001/REQ-002 of
   * `AmityModuleEnforcementMode` with P0 cases of their own. Testing them again
   * from here would be testing the SDK.
   *
   * What is still the UIKit's, and is what these fix, is everything it does
   * *with* a decoded answer.
   */
  const settings = (raw: unknown) => raw as Amity.ModuleSettings;

  it('keeps every key core sent, including one this build does not know', () => {
    // There is one key space now, so the interesting case is no longer a
    // translation but a key the UIKit has no module for. It has to resolve: an
    // unknown module may be the prerequisite holding a module the UIKit does
    // own switched on, and ignoring it would break that chain.
    const answer = settings({
      enforcement: 'enforce',
      modules: { userRelationship: true, pushNotification: false },
      catalog: {
        userRelationship: { label: 'User Relationship', kind: 'api', requires: [] },
        pushNotification: { label: 'Push Notification', kind: 'api', requires: [] },
      },
    });

    expect(isFeatureEnabled('userRelationship', answer)).toBe(true);
    expect(isFeatureEnabled('pushNotification', answer)).toBe(false);
  });

  it('carries a module this build has no gate for, rather than tripping over it', () => {
    // `liveStreamModeration` is one of core's `setting` modules: the UIKit has
    // no surface for it and never asks about it. It still has to resolve,
    // because a catalog entry naming it as a prerequisite must.
    const answer = settings({
      enforcement: 'enforce',
      modules: { live: true, post: true, liveStreamModeration: true },
      catalog: {
        post: { label: 'Post', kind: 'api', requires: [] },
        live: { label: 'Live', kind: 'api', requires: ['post'] },
        liveStreamModeration: {
          label: 'Live Stream Moderation',
          kind: 'setting',
          requires: ['live'],
        },
      },
    });

    expect(requirementOf('liveStreamModeration', answer)).toEqual(['live']);
    expect(isFeatureEnabled('live', answer)).toBe(true);
  });

  it('reads requires as OR, on the keys as they arrive', () => {
    const answer = settings({
      enforcement: 'enforce',
      modules: { userRelationship: true, discovery: true },
      catalog: {
        userRelationship: { label: 'User Relationship', kind: 'api', requires: [] },
        discovery: { label: 'Discovery', kind: 'api', requires: ['userRelationship'] },
      },
    });

    expect(requirementOf('discovery', answer)).toEqual(['userRelationship']);
    expect(isFeatureEnabled('discovery', answer)).toBe(true);
  });

  it('counts only a literal true as a grant, whatever slipped through', () => {
    // Belt and braces over the SDK, not a duplicate of it: `isModuleGranted`
    // compares `=== true`, so a value the decode let past — a string, a 1, a
    // null — is read as not granted rather than as truthy.
    const answer = settings({
      enforcement: 'enforce',
      modules: { chat: 'true', live: 1, poll: null, community: true },
      catalog: CATALOG,
    });

    expect(isModuleGranted('chat', answer)).toBe(false);
    expect(isModuleGranted('live', answer)).toBe(false);
    expect(isModuleGranted('poll', answer)).toBe(false);
    expect(isModuleGranted('community', answer)).toBe(true);
  });

  it('fails open on every answer that is not core withholding something', () => {
    // The two the UIKit decides. No answer at all — an older core, a network
    // error, a rejected query — grants everything, and so does any mode that
    // is not `enforce`. The SDK's half is that a mode it does not recognise
    // decodes to `off`, which lands in this same branch; if that ever flipped
    // to `enforce`, a server-side rename would black out a customer's app.
    expect(isFeatureEnabled('chat', null)).toBe(true);
    expect(isFeatureEnabled('chat', undefined)).toBe(true);

    const notEnforced = settings({
      enforcement: 'off',
      modules: { chat: false },
      catalog: CATALOG,
    });
    expect(isEntitlementEnforced(notEnforced)).toBe(false);
    expect(isFeatureEnabled('chat', notEnforced)).toBe(true);

    // A response missing whole fields answers for nothing: core named no
    // module, so no module is gated.
    const bare = settings({ enforcement: 'enforce', modules: {}, catalog: {} });
    expect(isFeatureEnabled('chat', bare)).toBe(true);
  });

  it('keeps a setting module out of the way', () => {
    // `kind: "setting"` has no endpoint of its own, so there is nothing for the
    // UIKit to hide — but it is still a catalog entry another module may need.
    const answer = settings({
      enforcement: 'enforce',
      modules: {},
      catalog: { aiModeration: { label: 'AI Moderation', kind: 'setting', requires: [] } },
    });

    expect(requirementOf('aiModeration', answer)).toEqual([]);
  });
});
