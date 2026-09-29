/**
 * Where each navigation target lands, kept apart from the provider.
 *
 * The provider pulls in components, and those pull in CSS modules that the
 * test transform does not handle — so a suite that only wants to know which
 * page a target opens could not import it. The enum and the table have no
 * dependencies at all, which is what lets the gate be tested directly rather
 * than through a copy of it.
 */

export enum PageTypes {
  Explore = 'explore',
  NewsFeed = 'newsfeed',
  CommunityFeed = 'communityFeed',
  CommunityEdit = 'communityEdit',
  Category = 'category',
  ViewStoryPage = 'ViewStoryPage',
  SocialHomePage = 'SocialHomePage',
  PostDetailPage = 'PostDetailPage',
  CommunityProfilePage = 'CommunityProfilePage',
  CommunitySetupPage = 'CommunitySetupPage',
  UserProfilePage = 'UserProfilePage',
  EditUserProfilePage = 'EditUserProfilePage',
  UserRelationshipPage = 'UserRelationshipPage',
  BlockedUsersPage = 'BlockedUsersPage',
  UserPendingFollowRequestPage = 'UserPendingFollowRequestPage',
  SocialGlobalSearchPage = 'SocialGlobalSearchPage',
  SelectPostTargetPage = 'SelectPostTargetPage',
  DraftPage = 'DraftPage',
  PostComposerPage = 'PostComposerPage',
  MyCommunitiesSearchPage = 'MyCommunitiesSearchPage',
  StoryTargetSelectionPage = 'StoryTargetSelectionPage',
  PollTargetSelectionPage = 'PollTargetSelectionPage',
  EventTargetSelectionPage = 'EventTargetSelectionPage',
  EventPostTargetSelectionPage = 'EventPostTargetSelectionPage',
  AllCategoriesPage = 'AllCategoriesPage',
  CommunitiesByCategoryPage = 'CommunitiesByCategoryPage',
  CommunityAddCategoryPage = 'CommunityAddCategoryPage',
  CommunityAddMemberPage = 'CommunityAddMemberPage',
  CommunityInviteMemberPage = 'CommunityInviteMemberPage',
  CommunitySettingPage = 'CommunitySettingPage',
  CommunityPostPermissionPage = 'CommunityPostPermissionPage',
  CommunityStorySettingPage = 'CommunityStorySettingPage',
  PendingPostsPage = 'PendingPostsPage',
  CommunityMembershipPage = 'CommunityMembershipPage',
  CommunityPendingInvitationPage = 'CommunityPendingInvitationPage',
  CommunityCreatePage = 'CommunityCreatePage',
  PollPostComposerPage = 'PollPostComposerPage',
  LiveStreamTerminatedPage = 'LiveStreamTerminatedPage',
  LiveStreamBannedPage = 'LiveStreamBannedPage',
  LiveStreamPlayerPage = 'LiveStreamPlayerPage',
  LivestreamUnsupportedPage = 'LivestreamUnsupportedPage',
  LivestreamTargetSelectionPage = 'LivestreamTargetSelectionPage',
  CreateLivestreamPage = 'CreateLivestreamPage',
  NotificationTrayPage = 'NotificationTrayPage',
  PendingRequestPage = 'PendingRequestPage',
  DraftClipPage = 'DraftClipPage',
  ClipFeedPage = 'ClipFeedPage',
  EventSetupPage = 'EventSetupPage',
  UpcomingEventsPage = 'UpcomingEventsPage',
  PastEventsPage = 'PastEventsPage',
  EventDetailPage = 'EventDetailPage',
  EventAttendeesPage = 'EventAttendeesPage',
  VisitorUsageLimitPage = 'VisitorUsageLimitPage',
}

/**
 * The page each navigation target lands on.
 *
 * A door has to be gated on the room it opens, not only on itself. The Clips
 * chip on social home is owned by Feed because the clip feed is Feed's, but
 * some doors have no config id to own at all — the clip tap inside a post is a
 * handler on `post_content`, and a deep link or a push notification is not a
 * door in the UI at all. Those can only be stopped where they arrive, which is
 * here: every `goTo*Page` pushes onto the same stack, so one check covers all
 * of them, including the ones added next.
 *
 * Without it the page itself is the last line, and a page that renders null
 * for a switched-off module still leaves the customer looking at a blank
 * screen with no way back but the browser.
 *
 * Written out rather than derived from the enum name. Most ids do fall out of
 * a camel-to-snake conversion, but not all: `LiveStreamTerminatedPage` is
 * `livestream_terminated_page`, `StoryTargetSelectionPage` is
 * `select_story_target_page`. A conversion would miss those silently, and a
 * miss here fails open — no owner found, no gate, no error. Typed as a total
 * record so the compiler names any target added without a decision, and `null`
 * says the decision was "no owner": a base-layer page, or one of the v3 types
 * that has no config id.
 */
export const PAGE_ID_BY_TYPE: Record<PageTypes, string | null> = {
  [PageTypes.Explore]: null,
  [PageTypes.NewsFeed]: null,
  [PageTypes.CommunityFeed]: null,
  [PageTypes.CommunityEdit]: null,
  [PageTypes.Category]: null,
  [PageTypes.ViewStoryPage]: 'story_page',
  [PageTypes.SocialHomePage]: 'social_home_page',
  [PageTypes.PostDetailPage]: 'post_detail_page',
  [PageTypes.CommunityProfilePage]: 'community_profile_page',
  [PageTypes.CommunitySetupPage]: 'community_setup_page',
  [PageTypes.UserProfilePage]: 'user_profile_page',
  [PageTypes.EditUserProfilePage]: 'edit_user_profile_page',
  [PageTypes.UserRelationshipPage]: 'user_relationship_page',
  [PageTypes.BlockedUsersPage]: 'blocked_users_page',
  [PageTypes.UserPendingFollowRequestPage]: 'user_pending_follow_request_page',
  [PageTypes.SocialGlobalSearchPage]: 'social_global_search_page',
  [PageTypes.SelectPostTargetPage]: 'select_post_target_page',
  [PageTypes.DraftPage]: null,
  [PageTypes.PostComposerPage]: 'post_composer_page',
  [PageTypes.MyCommunitiesSearchPage]: 'my_communities_search_page',
  [PageTypes.StoryTargetSelectionPage]: 'select_story_target_page',
  [PageTypes.PollTargetSelectionPage]: 'select_poll_target_page',
  [PageTypes.EventTargetSelectionPage]: 'select_event_target_page',
  [PageTypes.EventPostTargetSelectionPage]: 'event_post_target_selection_page',
  [PageTypes.AllCategoriesPage]: 'all_categories_page',
  [PageTypes.CommunitiesByCategoryPage]: 'communities_by_category_page',
  [PageTypes.CommunityAddCategoryPage]: 'community_add_category_page',
  [PageTypes.CommunityAddMemberPage]: 'community_add_member_page',
  [PageTypes.CommunityInviteMemberPage]: 'community_invite_member_page',
  [PageTypes.CommunitySettingPage]: 'community_setting_page',
  [PageTypes.CommunityPostPermissionPage]: 'community_post_permission_page',
  [PageTypes.CommunityStorySettingPage]: 'community_story_permission_page',
  [PageTypes.PendingPostsPage]: 'pending_posts_page',
  [PageTypes.CommunityMembershipPage]: 'community_membership_page',
  [PageTypes.CommunityPendingInvitationPage]: 'community_pending_invitation_page',
  [PageTypes.CommunityCreatePage]: null,
  [PageTypes.PollPostComposerPage]: 'poll_post_composer_page',
  [PageTypes.LiveStreamTerminatedPage]: 'livestream_terminated_page',
  [PageTypes.LiveStreamBannedPage]: 'livestream_banned_page',
  [PageTypes.LiveStreamPlayerPage]: 'livestream_player_page',
  // The page declares `livestream_unsupported_page`, but that id appears in
  // neither the owner table nor the customization schema — nothing gates it
  // and nothing can theme it, so there is no owner to look up. Left null
  // rather than naming an id the gate would never match; the id's absence from
  // both tables is worth fixing on its own.
  [PageTypes.LivestreamUnsupportedPage]: null,
  [PageTypes.LivestreamTargetSelectionPage]: 'select_livestream_target_page',
  [PageTypes.CreateLivestreamPage]: 'create_livestream_page',
  [PageTypes.NotificationTrayPage]: 'notification_tray_page',
  [PageTypes.PendingRequestPage]: 'pending_request_page',
  [PageTypes.DraftClipPage]: 'draft_clip_page',
  [PageTypes.ClipFeedPage]: 'clip_feed_page',
  [PageTypes.EventSetupPage]: 'event_setup_page',
  [PageTypes.UpcomingEventsPage]: 'upcoming_events_page',
  [PageTypes.PastEventsPage]: 'past_events_page',
  [PageTypes.EventDetailPage]: 'event_detail_page',
  [PageTypes.EventAttendeesPage]: 'event_attendees_page',
  [PageTypes.VisitorUsageLimitPage]: null,
};

export const pageIdOfNavigationTarget = (type: PageTypes): string | null =>
  PAGE_ID_BY_TYPE[type] ?? null;
