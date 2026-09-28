import {
  AMITY_API_METHOD_MODULE,
  AMITY_API_MODULE,
  AMITY_COMPONENT_MODULE,
  AMITY_ELEMENT_MODULE,
  AMITY_PAGE_MODULE,
} from '~/v4/core/providers/CustomizationProvider/moduleGraph';
import {
  isFeatureEnabled as resolve,
  isModuleExcluded,
  type Config,
} from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';
import {} from '~/v4/core/providers/CustomizationProvider/entitlement';
import fullEntitlementJson from '~/v4/core/providers/CustomizationProvider/__tests__/fixtures/entitlement.full.json';
import { defaultConfig } from '~/v4/core/providers/CustomizationProvider/utils';
import { PageTypes, pageIdOfNavigationTarget } from '~/v4/core/providers/navigationTargets';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * The module flags are only worth anything if switching one off actually hides
 * the surface. Apollo proves the three platforms generate the same graph and
 * that isExcluded consults it; it cannot prove the traversal is right, and each
 * platform writes that traversal by hand. This is Web's half of that proof —
 * the Android half lives in AmityModuleFlagTest.
 */

/**
 * Core answered, nothing enforced: the shape every network reads today.
 *
 * Every case revokes its modules through the plan, because the plan is the only
 * thing that can withhold one. There was a `features` block in the customer's
 * own config beside it; it is gone, and so is the question of which of the two
 * a case was testing.
 */
// The fixture is the decoded model, not the wire payload: `Client.getModuleSettings`
// owns the decode now, so nothing here parses it.
const fullEntitlement = fullEntitlementJson as unknown as Amity.ModuleSettings;

/**
 * The plan with a list of modules revoked, under the mode that makes a
 * revocation bite.
 *
 * `enforce` is the point: under `off` and `shadow` core still serves every
 * module whatever the grants say, so a case built on either would assert that
 * nothing was hidden and pass for the wrong reason.
 */
const revoking = (off: readonly string[] = []): Amity.ModuleSettings => ({
  ...fullEntitlement,
  enforcement: 'enforce',
  modules: Object.fromEntries(
    Object.keys(fullEntitlement.modules).map((key) => [key, !off.includes(key)]),
  ),
});

// The provider's own functions, not copies of them — these wrappers only build
// the plan. Reimplementing the traversal here meant the suite stayed green no
// matter what isExcluded did.
const excluded = (path: string, off: readonly string[] = []) =>
  isModuleExcluded(path, revoking(off));

const isFeatureEnabled = (key: string, off: readonly string[] = []) => resolve(key, revoking(off));

describe('module flags', () => {
  it('leaves every module on when the plan revokes nothing', () => {
    expect(excluded('post_detail_page/*/*')).toBe(false);
    expect(excluded('clip_feed_page/*/*')).toBe(false);
    expect(isFeatureEnabled('ads', undefined)).toBe(true);
  });

  it('hides the pages a switched-off module owns, and nothing else', () => {
    const off = ['events'];
    expect(excluded('event_detail_page/*/*', off)).toBe(true);
    expect(excluded('post_detail_page/*/*', off)).toBe(false);
  });

  it('gives every clip surface to Post, feed and composer alike', () => {
    // Clip is not a module — core does not sell it — so its surfaces are owned
    // by what they are, and a clip is a kind of post. The split this used to
    // make, clip *feeds* to Feed and clip *making* to Post, went with the
    // 2026-09-23 note: Feed is the global feed and For You, and the clip feed
    // is neither.
    const noPost = ['post'];
    for (const path of [
      'clip_feed_page/*/*',
      'draft_clip_page/*/*',
      '*/user_clip_feed/*',
      '*/community_clip_feed/*',
      '*/*/clipsfeed_button',
      '*/*/clips_button',
      '*/*/create_clip_button',
      '*/*/empty_clip_feed',
    ]) {
      expect(excluded(path, noPost)).toBe(true);
    }

    // And Feed leaves all of them alone, which is the half that changed. The
    // Clips chip goes with the page it opens, both Post's, so the door and the
    // room still move together.
    const noFeed = ['feed'];
    expect(excluded('clip_feed_page/*/*', noFeed)).toBe(false);
    expect(excluded('*/*/clipsfeed_button', noFeed)).toBe(false);
    expect(excluded('*/user_clip_feed/*', noFeed)).toBe(false);
  });

  it('owns every clip surface, at all three levels', () => {
    // The clip feeds and their empty, private and blocked states were in no
    // owner table at all, so nothing withheld them — and they used to be gated
    // by a `useFeatureEnabled('clip')` in the component instead, which went
    // when clip stopped being a module. A surface with no owner is a surface
    // the gate cannot reach, and it reads exactly like one that is allowed.
    const noPost = ['post'];

    for (const path of [
      '*/community_clip_feed/*',
      '*/user_clip_feed/*',
      '*/*/empty_clip_feed',
      '*/*/empty_user_clip_feed',
      '*/*/private_user_clip_feed',
      '*/*/private_user_clip_feed_info',
      '*/*/blocked_user_clip_feed',
      '*/*/blocked_user_clip_feed_info',
    ]) {
      expect(excluded(path, noPost)).toBe(true);
    }
  });

  it('takes every clip surface with Post, whichever module declares it', () => {
    // The rule the ownership split rests on: no Post means no clip at all.
    // The doors are Post's and the feeds are Feed's, but Feed requires Post,
    // so one switch closes both — which is why the doors can sit with Post
    // without leaving a way in.
    //
    // Read from the tables rather than listed here, so a clip id added later
    // is covered the day it lands. A hand-kept list is how the clip feeds came
    // to have no owner at all: they were simply never added to one.
    const noPost = ['post'];
    const clipIds = [
      [AMITY_PAGE_MODULE, (id: string) => `${id}/*/*`],
      [AMITY_COMPONENT_MODULE, (id: string) => `*/${id}/*`],
      [AMITY_ELEMENT_MODULE, (id: string) => `*/*/${id}`],
    ] as const;

    const checked: string[] = [];
    for (const [table, toPath] of clipIds) {
      for (const id of Object.keys(table).filter((key) => key.includes('clip'))) {
        expect(excluded(toPath(id), noPost)).toBe(true);
        checked.push(id);
      }
    }

    // The tables really were read — an empty sweep would pass silently.
    expect(checked.length).toBeGreaterThan(15);
    expect(checked).toContain('clipsfeed_button');
    expect(checked).toContain('clip_feed_page');
  });

  it('owns the Explore tab with the headings inside it', () => {
    // Explore's titles and empty state are Discovery's, while the categories
    // and the community lists it shows are Community's. Without an id of its
    // own the tab survived Discovery being switched off and kept the lists,
    // losing only the headings — a list of communities with nothing saying
    // what it is.
    const noDiscovery = ['discovery'];

    expect(excluded('*/explore_component/*', noDiscovery)).toBe(true);
    // `explore_empty` is a component and `explore_empty_image` the element
    // inside it — asserted in their own segments, because a path that puts an
    // id in the wrong position resolves to no owner and reads as allowed.
    expect(excluded('*/explore_empty/*', noDiscovery)).toBe(true);
    expect(excluded('*/*/explore_empty_image', noDiscovery)).toBe(true);
    expect(excluded('*/*/explore_recommended_title', noDiscovery)).toBe(true);
    // The contents go with the tab. They were Community's while the tab had no
    // owner at all, which left Discovery able to take the headings and nothing
    // else; apollo puts the categories, the empty state and the recommended
    // and trending lists with Discovery, so the whole tab now answers to one
    // module.
    expect(excluded('*/explore_community_categories/*', noDiscovery)).toBe(true);
    expect(excluded('*/explore_community_empty/*', noDiscovery)).toBe(true);
    expect(excluded('*/recommended_communities/*', noDiscovery)).toBe(true);
    expect(excluded('*/trending_communities/*', noDiscovery)).toBe(true);
    // A community is still a community: the tab going does not take the
    // communities themselves, which is what Discovery selling alone means.
    expect(excluded('community_profile_page/*/*', noDiscovery)).toBe(false);
    expect(excluded('*/*/community_row', noDiscovery)).toBe(false);
  });

  it('takes the product badge off a media thumbnail with Product', () => {
    // The badge sat on image and video thumbnails counting tags, gated by
    // nothing: it read the tag count and the network's product-catalogue
    // setting, neither of which says whether this customer bought the module.
    // It draws its own positioned wrapper now, so switching Product off takes
    // the box with the badge instead of leaving a hole where one was.
    const noProduct = ['product'];

    expect(excluded('*/*/product_tag', noProduct)).toBe(true);
    // Post keeps the thumbnails themselves — the badge is Product's, the
    // picture under it is not. Asserted through the component that owns them:
    // `post_image` and `post_video` carry no owner of their own, so a wildcard
    // in that segment resolves to nothing and reads as allowed whatever is
    // switched off.
    expect(excluded('*/post_content/post_image', noProduct)).toBe(false);
    expect(excluded('*/post_content/post_video', noProduct)).toBe(false);
    // And Post going takes both, through `post_content` rather than the ids.
    expect(excluded('*/post_content/post_image', ['post'])).toBe(true);
  });

  it('takes dependents down with their dependency', () => {
    const off = ['community'];
    // post requires community, and the clip surfaces are post's.
    expect(excluded('community_profile_page/*/*', off)).toBe(true);
    expect(excluded('post_detail_page/*/*', off)).toBe(true);
    expect(excluded('clip_feed_page/*/*', off)).toBe(true);
    // chat depends on nothing, so it survives.
    expect(excluded('chat_page/*/*', off)).toBe(false);
  });

  it('gates a module with no page of its own at its components', () => {
    // Comment owns no page — it is always a component on somebody else's.
    const off = ['comment'];
    expect(excluded('*/comment_tray_component/*', off)).toBe(true);
    expect(excluded('*/comment_composer_bar/*', off)).toBe(true);
    // The page hosting the comments is not the comments, and stays.
    expect(excluded('post_detail_page/*/*', off)).toBe(false);
  });

  it("owns a feed tab's private and blocked states with the tab, not the follow graph", () => {
    // These read as User Relationship's — a privacy state exists because a
    // follow graph does — but they are the empty state *of a post feed*, and
    // they render on a tab Post owns. Split the two, and switching Post off
    // empties the tab while leaving its "this account is private" caption
    // behind on it. All four tabs, and each state's `_info` caption with it.
    const noPost = ['post'];

    for (const variant of ['', '_image', '_video', '_clip']) {
      for (const state of ['private_user', 'blocked_user']) {
        expect(excluded(`*/*/${state}${variant}_feed`, noPost)).toBe(true);
        expect(excluded(`*/*/${state}${variant}_feed_info`, noPost)).toBe(true);
      }
    }
  });

  it('hides the block row in the user menu, under whichever id it is wearing', () => {
    // One button in `UserMenu` doing three jobs — Manage blocked users on your
    // own profile, Block and Unblock on somebody else's — and the id follows
    // the job, because iOS and Android draw three separate rows and the gate
    // answers for each by the same name.
    //
    // It carried none of these until PDT-5564: `manage_blocked_users_button`
    // was on it as a test id, which nothing gates on, so the row stood while
    // `pushPage` refused the page it opens and tapping did nothing.
    const off = ['userRelationship'];

    for (const id of ['manage_blocked_users_button', 'block_user_button', 'unblock_user_button']) {
      expect(excluded(`user_profile_page/*/${id}`, off)).toBe(true);
      // The other direction, on the module that reads closest to this one: a
      // block is not a follow, but it is not a post either.
      expect(excluded(`user_profile_page/*/${id}`, ['post'])).toBe(false);
    }

    // And the page the row opens is the module's too, so the door and the room
    // go together rather than one of them surviving.
    expect(AMITY_PAGE_MODULE.blocked_users_page).toBe('userRelationship');
  });

  it('takes Block out of the 1-on-1 chat sheet with User Relationship, and leaves the sheet', () => {
    // AmityConversationChatUserActionComponent REQ-008: the Block row is
    // withheld by the module whichever label it wears, ANDed with the config
    // switch. The sheet is Chat's, so the path resolves to
    // [chat, chat, userRelationship] and either module takes the row.
    const sheet = 'chat_page/conversation_chat_user_action_component';

    for (const id of ['block_user_button', 'unblock_user_button']) {
      expect(excluded(`${sheet}/${id}`, ['userRelationship'])).toBe(true);
      expect(excluded(`${sheet}/${id}`, ['chat'])).toBe(true);
      // A module that owns neither the sheet nor the row leaves it alone.
      expect(excluded(`${sheet}/${id}`, ['post'])).toBe(false);
    }

    // REQ-008a, the negative control: Report is moderation, not a
    // relationship, so the sheet itself survives the module going — Mute and
    // Report still have somewhere to render.
    expect(excluded(`${sheet}/*`, ['userRelationship'])).toBe(false);
  });

  it('leaves User Relationship the follow controls and the lists that are only the graph', () => {
    // The counterpart, so moving the feeds does not quietly empty this module:
    // the follow and block buttons, the header's two counts, and the pages that
    // are nothing but the graph.
    const followOff = ['userRelationship'];

    for (const path of [
      '*/*/follow_user_button',
      '*/*/following_user_button',
      // The row inside the Following button's drawer. Unreachable anyway once
      // its door goes, but named so the gate answers for it by the same id the
      // other platforms use (module-availability-spec §10.2).
      '*/*/unfollow_user_button',
      '*/*/pending_user_button',
      '*/*/unblock_user_button',
      '*/*/user_follower',
      '*/*/user_following',
      'blocked_users_page/*/*',
      'user_relationship_page/*/*',
      'user_pending_follow_request_page/*/*',
    ]) {
      expect(excluded(path, followOff)).toBe(true);
    }

    // And the profile page hosting them is base layer, so it stays.
    expect(excluded('user_profile_page/*/*', followOff)).toBe(false);
    // The other direction for the newest of them, so the entry cannot be
    // satisfied by an owner table that withholds everything.
    expect(excluded('*/*/unfollow_user_button', ['post'])).toBe(false);
  });

  it('takes a feed entry point with the feed it opens', () => {
    // A door left standing on a withheld destination is the failure the third
    // segment of a config id exists to catch. These two open Feed's own
    // surfaces — the For You feed — so they go with it.
    const noFeed = ['feed'];
    expect(excluded('social_home_page/*/for_you_button', noFeed)).toBe(true);
    expect(excluded('*/*/for_you_sidebar_menu_item', noFeed)).toBe(true);
    expect(excluded('social_home_page/*/newsfeed_button', noFeed)).toBe(true);
    expect(excluded('*/*/newsfeed_sidebar_menu_item', noFeed)).toBe(true);

    // And the doors onto feeds Feed does not own stay put. The community tabs
    // open a community's posts, which is Post's since 2026-09-23; the timeline
    // avatar and label belong to the post and poll target pickers; the search
    // Posts tab lists `post_search_result`.
    expect(excluded('community_profile_page/*/community_media_tab_button', noFeed)).toBe(false);
    expect(excluded('community_profile_page/*/community_pin_tab_button', noFeed)).toBe(false);
    expect(excluded('community_profile_page/*/community_feed_tab_button', noFeed)).toBe(false);
    expect(excluded('select_post_target_page/*/my_timeline_avatar', noFeed)).toBe(false);
    expect(excluded('select_post_target_page/*/my_timeline_text', noFeed)).toBe(false);
    expect(excluded('*/top_search_bar/search_posts_tab_button', noFeed)).toBe(false);
  });

  it('gives Feed the global feed and For You, and leaves every other feed to Post', () => {
    // This case used to say the opposite — "a feed is Feed's, whichever feed
    // it is" — and the marketing definition recorded on PDT-5569 on
    // 2026-09-23 replaced it: Feed is sold as the global feed and For You, and
    // a community's or a user's feed is not part of that. Switching Feed off
    // used to empty a community profile and a user profile, which is not what
    // the customer stopped paying for.
    const noFeed = ['feed'];
    expect(excluded('social_home_page/newsfeed_component/*', noFeed)).toBe(true);
    expect(excluded('social_home_page/global_feed_component/*', noFeed)).toBe(true);

    // Everything else a customer can still see.
    expect(excluded('user_profile_page/user_feed/*', noFeed)).toBe(false);
    expect(excluded('community_profile_page/community_feed/*', noFeed)).toBe(false);
    expect(excluded('post_detail_page/*/*', noFeed)).toBe(false);
    expect(excluded('post_composer_page/*/*', noFeed)).toBe(false);

    // The view is only half of it. The data has to move with it, or the user
    // feed renders empty on a Feed-off network because its own fetcher was
    // refused — and an empty feed reads exactly like a user with no posts.
    // `AMITY_API_MODULE` gives the whole `Feed` stem to Feed, so the user feed
    // needs a per-method override; the community feed goes through
    // `PostRepository.getPosts` and needs none.
    expect(AMITY_API_METHOD_MODULE['Feed.getUserFeed']).toBe('post');
    expect(AMITY_API_METHOD_MODULE['Feed.getGlobalFeed']).toBeUndefined();
    expect(AMITY_API_MODULE.Feed).toBe('feed');

    // And Feed requires Post, so revoking Post still takes the global feeds
    // with it — this is a narrowing of Feed, not a way to keep a feed alive
    // without Post.
    const noPost = ['post'];
    expect(excluded('social_home_page/newsfeed_component/*', noPost)).toBe(true);
    expect(excluded('user_profile_page/user_feed/*', noPost)).toBe(true);
    expect(excluded('community_profile_page/community_feed/*', noPost)).toBe(true);
    expect(excluded('post_detail_page/*/*', noPost)).toBe(true);
  });

  it('keeps a requiresAny module while one alternative is on', () => {
    const off = ['post', 'story'];
    // reaction needs one of post/comment/chat/story — chat is still on.
    expect(isFeatureEnabled('reaction', off)).toBe(true);
    // product needs one of post/story — both are off.
    expect(isFeatureEnabled('product', off)).toBe(false);
  });

  it('leaves the notification tray to no module at all', () => {
    // The tray is one surface fed by seven modules — community invites and
    // join requests, follow requests, event_created, room_cohost_invite, post
    // reactions, comment replies, poll mentions. Any single owner means
    // revoking that one module empties the whole tray, including the items
    // from modules the customer still pays for. So none of its four ids is in
    // the tables, and this is the case that says so on purpose: four missing
    // rows otherwise read as a sync that dropped them.
    //
    // Core's catalog note puts the tray in Feed. This is where Web departs
    // from it.
    expect(AMITY_PAGE_MODULE.notification_tray_page).toBeUndefined();
    expect(AMITY_ELEMENT_MODULE.notification_tray_button).toBeUndefined();
    expect(AMITY_ELEMENT_MODULE.notifications).toBeUndefined();
    expect(AMITY_ELEMENT_MODULE.empty_notification).toBeUndefined();

    for (const off of [['feed'], ['pushNotification'], ['post'], ['community']]) {
      expect(excluded('notification_tray_page/*/*', off)).toBe(false);
      expect(excluded('*/*/notification_tray_button', off)).toBe(false);
    }

    // The gate that replaces it is per item, on tap — see 'withholds a tray
    // item whose subject is gone, even when its page is not' below. Deleting
    // one of these two cases without the other leaves the tray ungated.
    //
    // Push Notification keeps the preference page, which is OS-level push and
    // genuinely its own.
    expect(excluded('notification_preference_page/*/*', ['pushNotification'])).toBe(true);
  });

  it("gates a component rendering inside another module's page", () => {
    // The page table alone could not reach these: the story tab renders in the
    // newsfeed, the live chat feed inside the livestream player.
    expect(excluded('social_home_page/story_tab_component/*', ['story'])).toBe(true);
    const chatOff = ['chat'];
    expect(excluded('livestream_player_page/livestream_chat_feed/*', chatOff)).toBe(true);
    // Live itself is untouched.
    expect(excluded('livestream_player_page/*/*', chatOff)).toBe(false);
  });

  it('closes the doors into a module with it', () => {
    // The third segment. Reading only page and component emptied a module's
    // pages and left the Clips tab, the Create Story button and the follow
    // button standing on pages other modules own.
    expect(excluded('social_home_page/*/clipsfeed_button', ['post'])).toBe(true);
    expect(excluded('social_home_page/*/create_story_button', ['story'])).toBe(true);
    const followOff = ['userRelationship'];
    expect(excluded('user_profile_page/*/follow_user_button', followOff)).toBe(true);
    // The profile page itself is base layer and stays.
    expect(excluded('user_profile_page/*/*', followOff)).toBe(false);
  });

  it('never gates a page no module claims', () => {
    expect(excluded('visitor_usage_limit_page/*/*', ['community'])).toBe(false);
  });
});

describe('navigation targets', () => {
  /**
   * A door with no config id can only be stopped where it arrives.
   *
   * `NavigationProvider` refuses to push a page whose module is off, which is
   * what covers the clip tap inside a post, a deep link and a push
   * notification — none of them is an element anyone can own. The table it
   * reads is written out by hand, because the ids do not all fall out of the
   * enum name, and a wrong id fails open: no owner found, no gate, no error.
   *
   * So the ids are checked against the customization schema, which is the list
   * of ids that exist. Coverage of the enum is the compiler's job — the table
   * is a total record — and this is the other half: that each entry names
   * something real.
   */
  // Two sources, because neither is complete on its own: the owner table
  // carries only ids some module gates, and the customization schema only ids
  // that ship a default. An id in either one exists.
  const knownPageIds = new Set([
    ...Object.keys(AMITY_PAGE_MODULE),
    ...Object.keys(defaultConfig.customizations ?? {}).map((path) => String(path).split('/')[0]),
  ]);

  it('names a real page for every target it claims to gate', () => {
    const targets = Object.values(PageTypes).map((type) => ({
      type,
      pageId: pageIdOfNavigationTarget(type),
    }));

    const unknown = targets.filter((t) => t.pageId && !knownPageIds.has(t.pageId));

    expect(unknown).toEqual([]);
    // The sweep really ran: a typo in the readers above would empty it.
    expect(targets.filter((t) => t.pageId).length).toBeGreaterThan(30);
  });

  it("gates the pages whose module is not the door's", () => {
    // The cases the table exists for: a page owned by one module reached from
    // a surface owned by another. Named individually rather than derived from
    // the enum — deriving the id from the enum name is what the table replaced,
    // and a check built on that derivation reports pages that do not exist
    // (`live_stream_banned_page` beside `livestream_banned_page`) while
    // missing the ones that do.
    expect(pageIdOfNavigationTarget(PageTypes.ClipFeedPage)).toBe('clip_feed_page');
    expect(pageIdOfNavigationTarget(PageTypes.EventDetailPage)).toBe('event_detail_page');
    expect(pageIdOfNavigationTarget(PageTypes.StoryTargetSelectionPage)).toBe(
      'select_story_target_page',
    );
    expect(pageIdOfNavigationTarget(PageTypes.LiveStreamTerminatedPage)).toBe(
      'livestream_terminated_page',
    );
    expect(pageIdOfNavigationTarget(PageTypes.CommunityStorySettingPage)).toBe(
      'community_story_permission_page',
    );
  });

  it('gates the clip feed, which is the door it was added for', () => {
    expect(pageIdOfNavigationTarget(PageTypes.ClipFeedPage)).toBe('clip_feed_page');
    // Post's since 2026-09-23, not Feed's — a clip is a kind of post and the
    // clip feed is neither the global feed nor For You.
    expect(excluded('clip_feed_page/*/*', ['post'])).toBe(true);
    expect(excluded('clip_feed_page/*/*', ['feed'])).toBe(false);
  });
  it('gates the poll body, so the feeds that cannot filter still lose it', () => {
    // An element id, so it goes in the element segment. In the component
    // segment nothing resolves and the call returns false, which reads as
    // "not withheld" — a passing assertion that measured nothing.
    expect(AMITY_ELEMENT_MODULE.post_poll).toBe('poll');
    expect(excluded('*/*/post_poll', ['poll'])).toBe(true);
    // The other direction: a module that does not own it leaves it alone.
    expect(excluded('*/*/post_poll', ['ads'])).toBe(false);
    expect(excluded('*/*/post_poll')).toBe(false);
  });

  it('answers for every page the notification tray can open', () => {
    // A tray item cannot be withheld the way a button can: the server already
    // sent the notification. So the tray asks whether the destination is still
    // there and says something when it is not — these are the answers it gets.
    // Both directions for each, because a one-way assertion reads as a pass
    // while measuring nothing.
    expect(pageIdOfNavigationTarget(PageTypes.PostDetailPage)).toBe('post_detail_page');
    expect(excluded('post_detail_page/*/*', ['post'])).toBe(true);
    expect(excluded('post_detail_page/*/*', ['ads'])).toBe(false);

    expect(pageIdOfNavigationTarget(PageTypes.CommunityProfilePage)).toBe('community_profile_page');
    expect(excluded('community_profile_page/*/*', ['community'])).toBe(true);
    expect(excluded('community_profile_page/*/*', ['ads'])).toBe(false);

    expect(pageIdOfNavigationTarget(PageTypes.EventDetailPage)).toBe('event_detail_page');
    expect(excluded('event_detail_page/*/*', ['events'])).toBe(true);
    expect(excluded('event_detail_page/*/*', ['ads'])).toBe(false);

    expect(pageIdOfNavigationTarget(PageTypes.LiveStreamPlayerPage)).toBe('livestream_player_page');
    expect(excluded('livestream_player_page/*/*', ['live'])).toBe(true);
    expect(excluded('livestream_player_page/*/*', ['ads'])).toBe(false);
  });

  it("leaves the tray's two base-layer destinations always reachable", () => {
    // Written down because the tray has six branches and only four can be
    // refused. A user profile is base identity, so it has no owner and no
    // module can withhold it — an assertion expecting these to disappear would
    // be measuring nothing, whatever it reported.
    expect(AMITY_PAGE_MODULE.user_profile_page).toBeUndefined();
    expect(AMITY_PAGE_MODULE.edit_user_profile_page).toBeUndefined();
    expect(excluded('user_profile_page/*/*', ['userRelationship'])).toBe(false);
    expect(excluded('edit_user_profile_page/*/*', ['community'])).toBe(false);
  });
  it('keeps the membership list out of discovery, which only owns the search', () => {
    // The regression this pair exists for: MyCommunities drew its rows with
    // CommunitySearchResult, which is the component that shows search results
    // and answers to discovery's id. One id served two owners, so switching
    // Discovery off emptied the membership list — a module removing a surface it
    // does not own, with every component asking its own id correctly the whole
    // way down.
    //
    // Android and iOS never had it: both draw the row inside `my_communities`
    // and keep `community_search_result` under `social_global_search_page`.
    // Neither config carries a `social_home_page/community_search_result/...`
    // key; both carry `social_home_page/my_communities/community_display_name`,
    // which is what this now renders.
    expect(AMITY_COMPONENT_MODULE.my_communities).toBe('community');
    expect(AMITY_COMPONENT_MODULE.community_search_result).toBe('discovery');

    // The list belongs to community, both ways round.
    expect(excluded('social_home_page/my_communities/*', ['community'])).toBe(true);
    expect(excluded('social_home_page/my_communities/*', ['discovery'])).toBe(false);

    // Its rows too — they inherit the component, so the element path has to
    // answer the same way or the fix only moved the wrapper.
    expect(excluded('social_home_page/my_communities/community_display_name', ['discovery'])).toBe(
      false,
    );

    // And the search results still belong to discovery.
    expect(excluded('social_global_search_page/community_search_result/*', ['discovery'])).toBe(
      true,
    );
  });
  it('takes the pinned tab with Post, because a pinned list is a list of posts', () => {
    // Three owners in three weeks, so the history is worth keeping. It began
    // as community's, which left the tab standing over an empty body when Post
    // was revoked — `community_pin` rendered and every PostContent inside it
    // was withheld. Moving it to Post fixed that. PDT-5569 then asked for it to
    // go when Feed goes, so it moved again; and the 2026-09-23 note on that
    // same ticket settled that Feed is the global feed and For You only, which
    // sent it back here for good.
    expect(AMITY_ELEMENT_MODULE.community_pin_tab_button).toBe('post');
    expect(AMITY_COMPONENT_MODULE.community_pin).toBe('post');

    const noPost = ['post'];
    expect(excluded('community_profile_page/*/community_pin_tab_button', noPost)).toBe(true);
    expect(excluded('community_profile_page/community_pin/*', noPost)).toBe(true);

    // Community off takes them too, one link up the chain.
    const noCommunity = ['community'];
    expect(excluded('community_profile_page/*/community_pin_tab_button', noCommunity)).toBe(true);
    expect(excluded('community_profile_page/community_pin/*', noCommunity)).toBe(true);

    // Feed off leaves them alone, which is the direction PDT-5569 got wrong.
    // The whole community profile survives it: the tab row keeps all four tabs
    // and the post count stays.
    const noFeed = ['feed'];
    expect(excluded('community_profile_page/*/community_pin_tab_button', noFeed)).toBe(false);
    expect(excluded('community_profile_page/community_pin/*', noFeed)).toBe(false);
    expect(excluded('community_profile_page/*/community_info_posts', noFeed)).toBe(false);
    expect(excluded('community_profile_page/*/*', noFeed)).toBe(false);

    // And a module that owns neither leaves both alone.
    const noAds = ['ads'];
    expect(excluded('community_profile_page/*/community_pin_tab_button', noAds)).toBe(false);
    expect(excluded('community_profile_page/community_pin/*', noAds)).toBe(false);
  });
  it('takes the post half of the event screen with Post, and leaves the event half', () => {
    // Neither id had an owner, and an id no module claims is one the gate can
    // never withhold. So the discussion tab rendered "No posts yet" with its
    // own composer already gone — a tab that can never hold anything — and
    // "Post event to feed" stayed in the menu with nothing behind it.
    expect(AMITY_COMPONENT_MODULE.event_discussion).toBe('post');
    expect(AMITY_ELEMENT_MODULE.create_event_post_button).toBe('post');

    const noPost = ['post'];
    expect(excluded('event_detail_page/event_discussion/*', noPost)).toBe(true);
    expect(excluded('event_detail_page/*/create_event_post_button', noPost)).toBe(true);

    // Community off takes both, through `post requires community`.
    const noCommunity = ['community'];
    expect(excluded('event_detail_page/event_discussion/*', noCommunity)).toBe(true);
    expect(excluded('event_detail_page/*/create_event_post_button', noCommunity)).toBe(true);

    // The event screen is Events' and survives Post being revoked — that is the
    // whole point of the split.
    expect(excluded('event_detail_page/*/*', noPost)).toBe(false);

    // And neither id is downstream of Events. The page segment has to be a
    // wildcard to show it: on the real path `event_detail_page` is an owner in
    // its own right, so Events off withholds everything on that screen
    // whatever the other two segments say.
    const noEvents = ['events'];
    expect(excluded('event_detail_page/*/*', noEvents)).toBe(true);
    expect(excluded('*/event_discussion/*', noEvents)).toBe(false);
    expect(excluded('*/*/create_event_post_button', noEvents)).toBe(false);
  });
  it('withholds a tray item whose subject is gone, even when its page is not', () => {
    // A comment or poll notification opens post_detail_page, which Post owns,
    // and names content the page does not own. Comment is not a prerequisite of
    // Post, so revoking it leaves the page reachable — the tap went through and
    // landed on a post with no thread on it. The tray asks about the subject as
    // well as the page for exactly these categories.
    expect(AMITY_COMPONENT_MODULE.comment_tray_component).toBe('comment');
    expect(AMITY_ELEMENT_MODULE.post_poll).toBe('poll');
    expect(AMITY_PAGE_MODULE.post_detail_page).toBe('post');

    // The page stays reachable, which is what made this invisible.
    expect(excluded('post_detail_page/*/*', ['comment'])).toBe(false);
    expect(excluded('post_detail_page/*/*', ['poll'])).toBe(false);

    // The subject does not.
    expect(excluded('post_detail_page/comment_tray_component/*', ['comment'])).toBe(true);
    expect(excluded('post_detail_page/*/post_poll', ['poll'])).toBe(true);

    // And a module owning neither subject leaves both alone, so the tray does
    // not start refusing items it has no reason to.
    expect(excluded('post_detail_page/comment_tray_component/*', ['ads'])).toBe(false);
    expect(excluded('post_detail_page/*/post_poll', ['ads'])).toBe(false);

    // `post_comment` is a component id. Asked in the element segment it finds
    // no owner and reads as "not withheld" — written down because it is the
    // wrong path to reach for here.
    expect(excluded('*/*/post_comment', ['comment'])).toBe(false);
  });
  it('withholds the composer poll button from any call site, not one', () => {
    // `livestream_button` is an element, so the gate holds wherever the button
    // is rendered. `poll_button` was in the component table only, and the one
    // call site passed `componentId="poll_button"` so the path would resolve —
    // a gate that worked by the shape of its caller. Render it anywhere else,
    // or let the component default to `*`, and nothing owned it.
    expect(AMITY_ELEMENT_MODULE.poll_button).toBe('poll');
    expect(AMITY_ELEMENT_MODULE.livestream_button).toBe('live');

    // The path the composer builds now, with its own page and component.
    expect(excluded('post_composer_page/*/poll_button', ['poll'])).toBe(true);
    expect(excluded('*/*/poll_button', ['poll'])).toBe(true);

    // The old path still answers, so a caller that kept the workaround is fine.
    expect(excluded('post_composer_page/poll_button/poll_button', ['poll'])).toBe(true);

    // And a module that does not own it leaves it alone.
    expect(excluded('post_composer_page/*/poll_button', ['ads'])).toBe(false);
  });
});
