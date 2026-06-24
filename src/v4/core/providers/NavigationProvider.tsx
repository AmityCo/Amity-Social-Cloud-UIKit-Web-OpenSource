import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import { AmityStoryMediaType } from '~/v4/social/pages/DraftsPage/DraftsPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import {
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
} from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { resolveString } from '~/v4/core/localization';
import { AmityRoute } from './AmityUIKitProvider';
import { LiveStreamPlayerPageProps } from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { GoToPostDetailPageParams } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { useNotifications } from './NotificationProvider';
import { CreateLivestreamPageProps } from '~/v4/social/features/livestream/pages/CreateLivestreamPage';
import { EventSetupProps } from '~/v4/social/features';
import { UpcomingEventsPageProps } from '~/v4/social/pages/UpcomingEventsPage/UpcomingEventsPage';
import { EventDetailPageProps } from '~/v4/social/pages/EventDetailPage/EventDetailPage';
import { EventAttendeesPageProps } from '~/v4/social/pages/EventAttendeesPage/EventAttendeesPage';
import { NotificationAlignment } from '~/v4/core/components/Notification';

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

type Page =
  | {
      type: PageTypes.Explore | PageTypes.NewsFeed;
      context: { communityId?: string };
    }
  | {
      type: PageTypes.CommunityFeed;
      context: {
        communityId: string;
        isNewCommunity: boolean;
      };
    }
  | {
      type: PageTypes.CommunityEdit;
      context: {
        communityId: string;
        tab: string;
      };
    }
  | {
      type: PageTypes.Category;
      context: {
        categoryId: string;
        communityId?: string;
      };
    }
  | {
      type: PageTypes.ViewStoryPage;
      context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostDetailPage;
      context: {
        postId: string;
        communityId?: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
        commentId?: string;
        parentId?: string;
        rootId?: string;
        posts?: Amity.Post<'clip' | 'video'>[];
        selectedReplyComment?: Amity.Comment;
        showReplyCommentAt?: string;
        keyword?: string;
        isFromCommentClick?: boolean;
      };
    }
  | { type: PageTypes.CommunityProfilePage; context: { communityId: string; page?: number } }
  | { type: PageTypes.UserProfilePage; context: { userId: string; communityId?: string } }
  | { type: PageTypes.EditUserProfilePage; context: { userId: string } }
  | {
      type: PageTypes.UserRelationshipPage;
      context: { userId: string; selectedTab: UserRelationshipPageTabs };
    }
  | { type: PageTypes.UserPendingFollowRequestPage; context: { userId: string } }
  | { type: PageTypes.BlockedUsersPage }
  | { type: PageTypes.SocialHomePage; context: { communityId?: string } }
  | { type: PageTypes.SocialGlobalSearchPage; context: { tab?: string; keyword?: string } }
  | { type: PageTypes.MyCommunitiesSearchPage; context: { communityId?: string } }
  | { type: PageTypes.SelectPostTargetPage; context?: { isClipPost?: boolean } }
  | {
      type: PageTypes.DraftPage;
      context: {
        communityId?: string;
        mediaType: AmityStoryMediaType;
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostComposerPage;
      context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        mode: Mode;
        community?: Amity.Community;
        post?: Amity.Post;
        isClipPost?: boolean;
        targetName?: string;
      };
    }
  | {
      type: PageTypes.StoryTargetSelectionPage;
    }
  | {
      type: PageTypes.EventTargetSelectionPage;
    }
  | {
      type: PageTypes.AllCategoriesPage;
    }
  | {
      type: PageTypes.CommunitiesByCategoryPage;
      context: {
        categoryId: string;
      };
    }
  | {
      type: PageTypes.CommunitySetupPage;
      context: {
        mode: AmityCommunitySetupPageMode;
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityAddCategoryPage;
      context: {
        categories?: Amity.Category[];
      };
    }
  | {
      type: PageTypes.PollPostComposerPage;
      context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        pollType?: 'text' | 'image';
      };
    }
  | {
      type: PageTypes.CommunityAddMemberPage;
      context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      };
    }
  | {
      type: PageTypes.CommunityInviteMemberPage;
      context: {
        communityId?: string;
        onSubmit?: (userId: string[]) => void;
      };
    }
  | {
      type: PageTypes.CommunitySettingPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityPostPermissionPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityStorySettingPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.PendingPostsPage;
      context: {
        communityId: string;
      };
    }
  | {
      type: PageTypes.CommunityMembershipPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.CommunityPendingInvitationPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.PollTargetSelectionPage;
    }
  | {
      type: PageTypes.LiveStreamTerminatedPage;
    }
  | {
      type: PageTypes.LiveStreamBannedPage;
    }
  | {
      type: PageTypes.LiveStreamPlayerPage;
      context: LiveStreamPlayerPageProps;
    }
  | {
      type: PageTypes.LivestreamUnsupportedPage;
    }
  | {
      type: PageTypes.CreateLivestreamPage;
      context: CreateLivestreamPageProps;
    }
  | {
      type: PageTypes.LivestreamTargetSelectionPage;
    }
  | {
      type: PageTypes.NotificationTrayPage;
    }
  | {
      type: PageTypes.PendingRequestPage;
      context: {
        community: Amity.Community;
      };
    }
  | {
      type: PageTypes.DraftClipPage;
      context: {
        targetId: string;
        targetType: 'community' | 'user';
        community?: Amity.Community;
      };
    }
  | {
      type: PageTypes.ClipFeedPage;
      context: {
        currentPostId?: string;
        postIndex?: number;
        targetType?: 'community' | 'user';
        targetId?: string;
      };
    }
  | {
      type: PageTypes.EventSetupPage;
      context: EventSetupProps;
    }
  | {
      type: PageTypes.UpcomingEventsPage;
      context: UpcomingEventsPageProps;
    }
  | {
      type: PageTypes.PastEventsPage;
    }
  | {
      type: PageTypes.EventDetailPage;
      context: EventDetailPageProps;
    }
  | {
      type: PageTypes.EventAttendeesPage;
      context: EventAttendeesPageProps;
    }
  | {
      type: PageTypes.VisitorUsageLimitPage;
    };

type ContextValue = {
  page: Page;
  prevPage?: Page;
  prev2Page?: Page;
  prev3Page?: Page;
  currentClip: number;
  setCurrentClip: (index: number) => void;
  setDefaultPage: (page: Page) => void;
  onChangePage: (type: string) => void;
  onClickCategory: (categoryId: string) => void;
  onClickCommunity: (communityId: string) => void;
  onClickUser: (userId: string, pageType?: string) => void;
  onCommunityCreated: (communityId: string) => void;
  onEditCommunity: (communityId: string, tab?: string) => void;
  onMessageUser: (userId: string) => void;
  onBack: (page?: number) => void;
  goToUserProfilePage: (userId: string) => void;
  goToEditUserPage: (userId: string) => void;
  goToUserRelationshipPage: (userId: string, selectedTab: UserRelationshipPageTabs) => void;
  goToPendingFollowRequestPage: () => void;
  goToBlockedUsersPage: () => void;
  goToPostDetailPage: (context: GoToPostDetailPageParams) => void;
  goToCommunityProfilePage: (communityId: string, page?: number) => void;
  goToSocialGlobalSearchPage: (tab?: string, keyword?: string) => void;
  goToMyCommunitiesSearchPage: () => void;
  goToSelectPostTargetPage: () => void;
  goToSelectClipPostTargetPage: (context: { isClipPost: boolean }) => void;
  goToSelectPollPostTargetPage: () => void;
  goToStoryTargetSelectionPage: () => void;
  goToSelectEventTargetPage: () => void;
  goToPollPostComposerPage: (context: {
    targetId: string | null;
    targetType: 'community' | 'user';
    pollType?: 'text' | 'image';
  }) => void;
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
  goToNotificationTrayPage: () => void;
  setNavigationBlocker?: (
    params:
      | {
          title: ReactNode;
          content: ReactNode;
          okText: ReactNode;
        }
      | null
      | undefined,
  ) => void;
  goToPostComposerPage: (
    context:
      | {
          mode: Mode.CREATE;
          targetId: string | null;
          targetType: 'community' | 'user';
          community?: Amity.Community;
          isClipPost?: boolean;
        }
      | { mode: Mode.EDIT; post: Amity.Post; isClipPost?: boolean },
  ) => void;
  goToStoryCreationPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
  goToSocialHomePage: () => void;
  goToAllCategoriesPage: () => void;
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => void;
  goToCreateCommunityPage?: (context: { mode: AmityCommunitySetupPageMode }) => void;

  goToAddCategoryPage?: (context: { categories?: Amity.Category[] }) => void;
  goToAddMemberPage?: (context: {
    members?: MemberCommunitySetup[];
    communityId?: string;
    onAddedAction?: (userId: string[]) => void;
  }) => void;
  goToInviteMemberPage?: (context: {
    communityId?: string;
    onSubmit?: (userId: string[]) => void;
  }) => void;
  goToCommunitySettingPage?: (community: Amity.Community) => void;
  goToEditCommunityPage?: (context: {
    mode: AmityCommunitySetupPageMode;
    community: Amity.Community;
  }) => void;
  goToMembershipPage?: (community: Amity.Community) => void;
  goToPendingInvitationPage?: (community: Amity.Community) => void;
  goToPostPermissionPage?: (community: Amity.Community) => void;
  goToStorySettingPage?: (community: Amity.Community) => void;
  goToPendingPostPage?: (communityId: string) => void;
  goToLiveStreamTerminatedPage?: () => void;
  goToLiveStreamBannedPage?: () => void;
  goToLiveStreamPlayerPage?: (context: LiveStreamPlayerPageProps) => void;
  goToLivestreamUnsupportedPage: () => void;
  goToCreateLivestreamPage?: (context: CreateLivestreamPageProps) => void;
  goToPendingRequestPage?: (community: Amity.Community) => void;
  goToDraftClipPage?: (context: {
    targetId: string | null;
    targetType: 'community' | 'user';
    community?: Amity.Community;
  }) => void;
  goToClipFeedPage?: (context: {
    currentPostId?: string;
    postIndex?: number;
    targetType?: 'community' | 'user';
    targetId?: string;
  }) => void;
  onProductTagClick?: (context: { productTag: Amity.ProductTag }) => void;
  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;

  handleVisitorUserAction: (context: { alignment: NotificationAlignment }) => void;
  handleNonMemberAction: (context: { alignment: NotificationAlignment }) => void;
  handleNonFollowerAction: (context: { alignment: NotificationAlignment }) => void;
  handleVisitorUsageLimitSignIn: (context: { alignment: NotificationAlignment }) => void;
  goToEventSetupPage: (context: EventSetupProps) => void;
  goToUpcomingEventsPage: (context: UpcomingEventsPageProps) => void;
  goToPastEventsPage: () => void;
  goToEventDetailPage: (context: EventDetailPageProps) => void;
  goToEventAttendeesPage?: (context: EventAttendeesPageProps) => void;
  goToVisitorUsageLimitPage: () => void;
};

let defaultValue: ContextValue = {
  page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
  currentClip: 0,
  setCurrentClip: (index: number) => {},
  setDefaultPage: (page: Page) => {},
  onChangePage: (type: string) => {},
  onClickCategory: (categoryId: string) => {},
  onClickCommunity: (communityId: string) => {},
  onClickUser: (userId: string) => {},
  onCommunityCreated: (communityId: string) => {},
  onEditCommunity: (communityId: string) => {},
  onMessageUser: (userId: string) => {},
  goToUserProfilePage: (userId: string) => {},
  goToEditUserPage: (userId: string) => {},
  goToUserRelationshipPage: (userId: string, selectedTab: UserRelationshipPageTabs) => {},
  goToPendingFollowRequestPage: () => {},
  goToBlockedUsersPage: () => {},
  goToPostDetailPage: (context: GoToPostDetailPageParams) => {},
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => {},
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => {},
  goToCommunityProfilePage: (communityId: string, page?: number) => {},
  goToSocialGlobalSearchPage: (tab?: string, keyword?: string) => {},
  goToSelectPostTargetPage: () => {},
  goToSelectClipPostTargetPage: (context: { isClipPost: boolean }) => {},
  goToStoryTargetSelectionPage: () => {},
  goToSelectPollPostTargetPage: () => {},
  goToPollPostComposerPage: () => {},
  goToPostComposerPage: () => {},
  goToStoryCreationPage: () => {},
  goToDraftClipPage: (context: {
    targetId: string | null;
    targetType: 'community' | 'user';
    community?: Amity.Community;
  }) => {},
  goToSocialHomePage: () => {},
  goToMyCommunitiesSearchPage: () => {},
  goToAllCategoriesPage: () => {},
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => {},
  goToCreateCommunityPage: () => {},
  goToAddCategoryPage: () => {},
  goToAddMemberPage: () => {},
  goToInviteMemberPage: () => {},
  goToCommunitySettingPage: (community: Amity.Community) => {},
  goToEditCommunityPage: () => {},
  goToMembershipPage: (community: Amity.Community) => {},
  goToPendingInvitationPage: (community: Amity.Community) => {},
  goToPostPermissionPage: (community: Amity.Community) => {},
  goToStorySettingPage: (community: Amity.Community) => {},
  goToPendingPostPage: (communityId: string) => {},
  goToLiveStreamTerminatedPage: () => {},
  goToLiveStreamBannedPage: () => {},
  goToLiveStreamPlayerPage: (context: LiveStreamPlayerPageProps) => {},
  goToLivestreamUnsupportedPage: () => {},
  goToCreateLivestreamPage: (context: CreateLivestreamPageProps) => {},
  goToNotificationTrayPage: () => {},
  goToClipFeedPage: (context: {
    currentPostId?: string;
    postIndex?: number;
    targetType?: 'community' | 'user';
    targetId?: string;
  }) => {},
  goToSelectEventTargetPage: () => {},

  setNavigationBlocker: () => {},
  onBack: (page?: number) => {},
  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => {},
  handleVisitorUserAction: () => {},
  handleNonMemberAction: () => {},
  handleNonFollowerAction: () => {},
  handleVisitorUsageLimitSignIn: () => {},
  goToEventSetupPage: (context: EventSetupProps) => {},
  goToUpcomingEventsPage: () => {},
  goToPastEventsPage: () => {},
  goToEventDetailPage: (context: EventDetailPageProps) => {},
  goToEventAttendeesPage: (context: EventAttendeesPageProps) => {},
  goToVisitorUsageLimitPage: () => {},
};

if (process.env.NODE_ENV !== 'production') {
  defaultValue = {
    page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
    currentClip: 0,
    setCurrentClip: (index: number) => console.log(`Current Clip ${index}`),
    setDefaultPage: (page: Page) => console.log(`Default page ${page}`),
    onChangePage: (type) => console.log(`NavigationContext onChangePage(${type})`),
    onClickCategory: (categoryId) =>
      console.log(`NavigationContext onClickCategory(${categoryId})`),
    onClickCommunity: (communityId) =>
      console.log(`NavigationContext onClickCommunity(${communityId})`),
    onClickUser: (userId) => console.log(`NavigationContext onClickUser(${userId})`),
    goToViewStoryPage: ({ targetId, storyType, targetType }) =>
      console.log(`NavigationContext goToViewStoryPage(${targetId}, ${storyType}, ${targetType})`),
    onCommunityCreated: (communityId) =>
      console.log(`NavigationContext onCommunityCreated(${communityId})`),
    onEditCommunity: (communityId) =>
      console.log(`NavigationContext onEditCommunity({${communityId})`),
    onMessageUser: (userId) => console.log(`NavigationContext onMessageUser(${userId})`),
    onBack: (page?: number) => console.log(`NavigationContext onBack(${page})`),
    goToUserProfilePage: (userId) =>
      console.log(`NavigationContext goToUserProfilePage(${userId})`),
    goToEditUserPage: (userId) => console.log(`NavigationContext goToEditUserPage(${userId})`),
    goToUserRelationshipPage: (userId, selectedTab) =>
      console.log(`NavigationContext goToUserRelationshipPage(${userId}, ${selectedTab})`),
    goToPendingFollowRequestPage: () =>
      console.log(`NavigationContext goToPendingFollowRequestPage()`),
    goToBlockedUsersPage: () => console.log(`NavigationContext goToBlockedUsersPage()`),
    goToPostDetailPage: ({
      postId,
      hideTarget,
      category,
      commentId,
      parentId,
      posts,
      keyword,
      rootId,
    }) =>
      console.log(
        `NavigationContext goToPostDetailPage(${postId} ${hideTarget} ${category} ${commentId} ${parentId} ${posts} ${keyword} ${rootId})`,
      ),
    goToCommunityProfilePage: (communityId, page) =>
      console.log(`NavigationContext goToCommunityProfilePage(${communityId} ${page})`),
    goToSocialGlobalSearchPage: (tab, keyword) =>
      console.log(`NavigationContext goToSocialGlobalSearchPage(${tab} ${keyword})`),
    goToSelectPostTargetPage: () => console.log('NavigationContext goToTargetPage()'),
    goToSelectClipPostTargetPage: (context: { isClipPost: boolean }) =>
      console.log(`NavigationContext goToSelectClipPostTargetPage(${context.isClipPost})`),
    goToSelectPollPostTargetPage: () =>
      console.log(`NavigationContext goToSelectPollPostTargetPage()`),
    goToPollPostComposerPage: (context) =>
      console.log(`NavigationContext goToPollPostComposerPage(${context})`),
    goToStoryTargetSelectionPage: () =>
      console.log('NavigationContext goToStoryTargetSelectionPage()'),
    goToSelectEventTargetPage: () => console.log('NavigationContext goToSelectEventTargetPage()'),
    goToDraftStoryPage: (data) => console.log(`NavigationContext goToDraftStoryPage()`),
    goToPostComposerPage: () => console.log(`NavigationContext goToPostComposerPage()`),
    goToStoryCreationPage: () => console.log('NavigationContext goToStoryCreationPage()'),
    goToDraftClipPage: (context) => console.log(`NavigationContext goToDraftClipPage(${context})`),
    goToSocialHomePage: () => console.log('NavigationContext goToSocialHomePage()'),
    goToMyCommunitiesSearchPage: () =>
      console.log('NavigationContext goToMyCommunitiesSearchPage()'),
    goToAllCategoriesPage: () => console.log('NavigationContext goToAllCategoriesPage()'),
    goToCommunitiesByCategoryPage: (context) =>
      console.log(`NavigationContext goToCommunitiesByCategoryPage(${context})`),
    goToCreateCommunityPage: () => console.log('NavigationContext goToCreateCommunityPage()'),
    goToEditCommunityPage: () => console.log('NavigationContext goToEditCommunityPage()'),
    goToAddCategoryPage: () => console.log('NavigationContext goToAddCategoryPage()'),
    goToAddMemberPage: () => console.log('NavigationContext goToAddMemberPage()'),
    goToInviteMemberPage: () => console.log('NavigationContext goToInviteMemberPage()'),
    goToPendingInvitationPage: () => console.log('NavigationContext goToPendingInvitationsPage()'),
    goToCommunitySettingPage: (community) =>
      console.log(`NavigationContext goToCommunitySettingPage(${community})`),
    goToLiveStreamTerminatedPage: () =>
      console.log('NavigationContext goToLiveStreamTerminatedPage()'),
    goToLiveStreamBannedPage: () => console.log('NavigationContext goToLiveStreamBannedPage()'),
    goToLiveStreamPlayerPage: (context) =>
      console.log(`NavigationContext goToLiveStreamPlayerPage(${context})`),
    goToLivestreamUnsupportedPage: () =>
      console.log('NavigationContext goToLivestreamUnsupportedPage()'),
    goToCreateLivestreamPage: (context) =>
      console.log(`NavigationContext goToCreateLivestreamPage(${JSON.stringify(context)})`),
    goToNotificationTrayPage: () => console.log('NavigationContext goToNotificationTrayPage()'),
    goToPendingRequestPage: (context) =>
      console.log(`NavigationContext goToPendingRequestPage(${context})`),
    goToClipFeedPage: (context) => console.log(`NavigationContext goToClipFeedPage(${context})`),
    onProductTagClick: (context: { productTag: Amity.ProductTag }) =>
      console.log(`NavigationContext onProductTagClick(${JSON.stringify(context)})`),
    //V3 functions
    onClickStory: (storyId, storyType, targetIds) =>
      console.log(`NavigationContext onClickStory(${storyId}, ${storyType}, ${targetIds})`),

    handleVisitorUserAction: () => console.log('NavigationContext handleVisitorUserAction()'),
    handleNonMemberAction: () => console.log('NavigationContext handleNonMemberAction()'),
    handleNonFollowerAction: () => console.log('NavigationContext handleNonFollowerAction()'),
    handleVisitorUsageLimitSignIn: () =>
      console.log('NavigationContext handleVisitorUsageLimitSignIn()'),

    goToEventSetupPage: (context) =>
      console.log(`NavigationContext goToEventSetupPage(${context.mode})`),
    goToUpcomingEventsPage: (context) =>
      console.log(`NavigationContext goToUpcomingEventsPage()`, context),
    goToPastEventsPage: () => console.log('NavigationContext goToPastEventsPage()'),
    goToEventDetailPage: (context) =>
      console.log('NavigationContext goToEventDetailPage()', context),
    goToEventAttendeesPage: (context) =>
      console.log('NavigationContext goToEventAttendeesPage()', context),
    goToVisitorUsageLimitPage: () => console.log('NavigationContext goToVisitorUsageLimitPage()'),
  };
}

export const NavigationContext = createContext<ContextValue>(defaultValue);

export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  askForConfirmation?: (params: {
    title: React.ReactNode;
    content: React.ReactNode;
    okText: React.ReactNode;
    onSuccess: () => void;
    onCancel: () => void;
  }) => void;
  children: React.ReactNode;
  onChangePage?: (
    data:
      | { type: string; [x: string]: string | boolean }
      | {
          type: string;
          context: {
            [x: string]: string | boolean;
          };
        },
  ) => void;
  onClickCategory?: (categoryId: string) => void;
  onClickCommunity?: (communityId: string) => void;
  onClickUser?: (userId: string) => void;
  goToViewStoryPage?: (context: {
    storyId: string;
    storyType: 'communityFeed' | 'globalFeed';
    targetType: Amity.StoryTargetType;
  }) => void;
  goToDraftStoryPage?: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToAllCategoriesPage?: () => void;
  goToCommunitiesByCategoryPage?: (context: { categoryId: string }) => void;
  goToCreateCommunityPage?: (context: { mode: AmityCommunitySetupPageMode }) => void;
  goToEditCommunityPage?: (context: {
    mode: AmityCommunitySetupPageMode;
    community: Amity.Community;
  }) => void;
  goToPendingRequestPage?: (context: { community: Amity.Community }) => void;
  goToClipFeedPage?: (context: {
    currentPostId?: string;
    postIndex?: number;
    targetType?: 'community' | 'user';
    targetId?: string;
  }) => void;

  onCommunityCreated?: (communityId: string) => void;
  goToCommunityCreatePage?: () => void;
  onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
  onEditUser?: (userId: string) => void;
  onMessageUser?: (userId: string) => void;
  onBack?: (page?: number) => void;
  //V3 functions
  onClickStory?: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;
  activeRoute?: AmityRoute;
  onRouteChange?: (route: AmityRoute) => void;
  onEmptyNavigationStack?: () => void;
}

const getDefaultRoute = (activeRoute?: AmityRoute): Page => {
  if (activeRoute?.route === 'community') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId: activeRoute.id,
        },
      };
    }
  }
  if (activeRoute?.route === 'user') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.UserProfilePage,
        context: {
          userId: activeRoute.id,
        },
      };
    }
  }

  if (activeRoute?.route === 'post') {
    if (activeRoute?.id) {
      return {
        type: PageTypes.PostDetailPage,
        context: {
          postId: activeRoute?.id,
        },
      };
    }
  }

  return { type: PageTypes.SocialHomePage, context: { communityId: undefined } };
};

export default function NavigationProvider({
  askForConfirmation,
  children,
  activeRoute,
  onRouteChange,
  onChangePage: onChangePageProp,
  onClickCategory,
  onClickCommunity,
  onClickUser,
  onCommunityCreated,
  onEditCommunity,
  onEditUser,
  onMessageUser,
  onBack,
  onEmptyNavigationStack,
}: NavigationProviderProps) {
  const [pages, setPages] = useState<Page[]>([getDefaultRoute(activeRoute)]);
  const currentPage = useMemo(() => pages[pages.length - 1], [pages]);
  const prevPage = useMemo((page = 2) => pages[pages.length - page], [pages]);
  const prev2Page = useMemo((page = 3) => pages[pages.length - page], [pages]);
  const [currentClip, setCurrentClip] = useState(0);
  const notification = useNotifications();

  const [navigationBlocker, setNavigationBlocker] = useState<
    | {
        title: ReactNode;
        content: ReactNode;
        okText: ReactNode;
      }
    | null
    | undefined
  >();

  const confirmation = askForConfirmation ?? confirm;

  const { setStreamPlayer } = useLayoutContext();

  const pushPage = useCallback(async (newPage) => {
    setPages((prevState) => [...prevState, newPage]);
  }, []);

  const setDefaultPage = useCallback((defaultPage) => {
    setPages([defaultPage]);
  }, []);

  const popPage = (page?: number) => {
    setPages((prevState) => {
      const pagesToRemove = page && page > 0 ? page : 1;

      if (prevState.length > pagesToRemove) {
        return prevState.slice(0, -pagesToRemove);
      } else {
        if (onEmptyNavigationStack) {
          onEmptyNavigationStack();
          return prevState;
        }
        return [{ type: PageTypes.SocialHomePage, context: { communityId: undefined } }];
      }
    });
  };

  const onChangePage = onChangePageProp
    ? async (
        data:
          | { type: string; [x: string]: string | boolean }
          | {
              type: string;
              context: {
                [x: string]: string | boolean;
              };
            },
      ) => {
        onChangePageProp(data);
      }
    : null;

  const handleChangePage = useCallback(
    (type) => {
      pushPage({ type });
    },
    [pushPage],
  );

  const handleClickCommunity = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCommunity) return onClickCommunity(communityId);

      pushPage(next);
    },
    [onClickCommunity, pushPage],
  );

  const handleCommunityCreated = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        communityId,
        isNewCommunity: true,
      };

      if (onChangePage) return onChangePage(next);
      if (onCommunityCreated) return onCommunityCreated(communityId);

      pushPage(next);
    },
    [onChangePage, onCommunityCreated, pushPage],
  );

  const handleClickCategory = useCallback(
    (categoryId) => {
      const next = {
        type: PageTypes.Category,
        categoryId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCategory) return onClickCategory(categoryId);

      pushPage(next);
    },
    [onChangePage, onClickCategory, pushPage],
  );

  const handleClickUser = useCallback(
    (userId, pageType) => {
      const next = {
        type: pageType ?? PageTypes.UserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickUser) return onClickUser(userId);

      pushPage(next);
    },
    [onChangePage, onClickUser, pushPage],
  );

  const handleEditUser = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.EditUserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      pushPage(next);
    },
    [onChangePage, onEditUser, pushPage],
  );

  const goToEditUserPage = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.EditUserProfilePage,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      pushPage(next);
    },
    [onChangePage, onEditUser, pushPage],
  );

  const goToUserRelationshipPage = useCallback(
    (userId, selectedTab) => {
      const next = {
        type: PageTypes.UserRelationshipPage,
        context: {
          userId,
          selectedTab,
        },
      };

      if (onChangePage) return onChangePage(next);

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPendingFollowRequestPage = useCallback(() => {
    const next = {
      type: PageTypes.UserPendingFollowRequestPage,
    };

    if (onChangePage) return onChangePage(next);

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToBlockedUsersPage = useCallback(() => {
    const next = {
      type: PageTypes.BlockedUsersPage,
    };

    if (onChangePage) return onChangePage(next);

    pushPage(next);
  }, [onChangePage, pushPage]);

  const handleEditCommunity = useCallback(
    (communityId, tab) => {
      const next = {
        type: PageTypes.CommunityEdit,
        context: {
          communityId,
          tab,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditCommunity) return onEditCommunity(communityId, { tab });

      pushPage(next);
    },
    [onChangePage, onEditCommunity, pushPage],
  );

  const handleMessageUser = useCallback(
    (userId) => {
      const next = {
        type: 'conversation',
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onMessageUser) return onMessageUser(userId);
    },
    [onChangePage, onMessageUser],
  );

  const handleBack = useCallback(
    (page?: number) => {
      if (onBack) {
        onBack(page);
      }
      popPage(page);
    },
    [onChangePage, onBack, popPage],
  );

  const goToViewStoryPage = useCallback(
    ({ targetId, storyType, targetType }) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToUserProfilePage = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.UserProfilePage,
        context: {
          userId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPostDetailPage = useCallback(
    (context) => {
      const next = {
        type: PageTypes.PostDetailPage,
        context,
      };
      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunityProfilePage = useCallback(
    (communityId, page = 1) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
          page,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToSocialGlobalSearchPage = useCallback(
    (tab?: string, keyword?: string) => {
      const next = {
        type: PageTypes.SocialGlobalSearchPage,
        context: { tab, keyword },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );
  const goToSelectPostTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.SelectPostTargetPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToSelectClipPostTargetPage = useCallback(
    ({ isClipPost }) => {
      const next = {
        type: PageTypes.SelectPostTargetPage,
        context: {
          isClipPost,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToStoryTargetSelectionPage = useCallback(() => {
    const next = {
      type: PageTypes.StoryTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToSelectEventTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.EventTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToSelectPollPostTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.PollTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToStoryCreationPage = useCallback(
    ({ targetId, targetType, mediaType, storyType }) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToDraftClipPage = useCallback(
    ({ targetId, targetType, community }) => {
      const next = {
        type: PageTypes.DraftClipPage,
        context: {
          targetId,
          targetType,
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToDraftStoryPage = useCallback(
    (targetId, targetType, mediaType, storyType) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToSocialHomePage = useCallback(() => {
    const next = {
      type: PageTypes.SocialHomePage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToPostComposerPage = useCallback(
    (
      context:
        | {
            mode: Mode.CREATE;
            targetId: string | null;
            targetType: 'community' | 'user';
            community?: Amity.Community;
            isClipPost?: boolean;
          }
        | { mode: Mode.EDIT; post: Amity.Post; isClipPost?: boolean },
    ) => {
      const next = {
        type: PageTypes.PostComposerPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCreateCommunityPage = useCallback(() => {
    const next = {
      type: PageTypes.CommunitySetupPage,
      context: {
        mode: AmityCommunitySetupPageMode.CREATE,
      },
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToEditCommunityPage = useCallback(
    ({ mode, community }) => {
      const next = {
        type: PageTypes.CommunitySetupPage,
        context: {
          mode,
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToMyCommunitiesSearchPage = useCallback(() => {
    const next = {
      type: PageTypes.MyCommunitiesSearchPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToAllCategoriesPage = useCallback(() => {
    const next = {
      type: PageTypes.AllCategoriesPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToCommunitiesByCategoryPage = useCallback(
    (context) => {
      const next = {
        type: PageTypes.CommunitiesByCategoryPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToAddCategoryPage = useCallback(
    ({ categories }) => {
      const next = {
        type: PageTypes.CommunityAddCategoryPage,
        context: {
          categories,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToAddMemberPage = useCallback(
    ({ member, communityId, onAddedAction }) => {
      const next = {
        type: PageTypes.CommunityAddMemberPage,
        context: {
          member,
          communityId,
          onAddedAction,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToInviteMemberPage = useCallback(
    ({ communityId, onSubmit }) => {
      const next = {
        type: PageTypes.CommunityInviteMemberPage,
        context: { communityId, onSubmit },
      };
      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const handleClickStory = useCallback(
    (targetId, storyType, targetIds) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetIds,
        },
      };

      if (onChangePage) return onChangePage(next);

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunitySettingPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunitySettingPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPostPermissionPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityPostPermissionPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToStorySettingPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityStorySettingPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPendingPostPage = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.PendingPostsPage,
        context: {
          communityId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToMembershipPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityMembershipPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPendingInvitationPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.CommunityPendingInvitationPage,
        context: { community },
      };
      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPollPostComposerPage = useCallback(
    ({ targetId, targetType, pollType }) => {
      const next = {
        type: PageTypes.PollPostComposerPage,
        context: {
          targetId,
          targetType,
          pollType,
        },
      };
      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToLiveStreamTerminatedPage = useCallback(() => {
    const next = {
      type: PageTypes.LiveStreamTerminatedPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToLiveStreamBannedPage = useCallback(() => {
    const next = {
      type: PageTypes.LiveStreamBannedPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToLiveStreamPlayerPage = useCallback(
    (context: LiveStreamPlayerPageProps) => {
      setStreamPlayer(context); // modal as page
    },
    [setStreamPlayer],
  );

  const goToLivestreamUnsupportedPage = useCallback(() => {
    const next = {
      type: PageTypes.LivestreamUnsupportedPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToCreateLivestreamPage = useCallback(
    (context: CreateLivestreamPageProps) => {
      const next = {
        type: PageTypes.CreateLivestreamPage,
        context,
      };

      pushPage(next);
    },
    [pushPage],
  );

  const goToNotificationTrayPage = useCallback(() => {
    const next = {
      type: PageTypes.NotificationTrayPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToPendingRequestPage = useCallback(
    (community) => {
      const next = {
        type: PageTypes.PendingRequestPage,
        context: {
          community,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToClipFeedPage = useCallback(
    ({ currentPostId, postIndex, targetType, targetId }) => {
      const next = {
        type: PageTypes.ClipFeedPage,
        context: {
          currentPostId,
          postIndex,
          targetType,
          targetId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const handleVisitorUserAction = (context: { alignment: NotificationAlignment }) => {
    notification.info({
      content: resolveString('amity_social_label_create_account_or_sign_in'),
      alignment: context.alignment,
    });
  };

  const handleNonMemberAction = (context: { alignment: NotificationAlignment }) => {
    notification.info({
      content: resolveString('amity_common_label_join_community_to_interact'),
      alignment: context.alignment,
    });
  };

  const handleNonFollowerAction = (context: { alignment: NotificationAlignment }) => {
    notification.info({
      content: resolveString('amity_common_label_follow_user_to_interact'),
      alignment: context.alignment,
    });
  };

  const handleVisitorUsageLimitSignIn = (context: { alignment: NotificationAlignment }) => {
    notification.info({
      content: resolveString('visitor_usage_limit_toast'),
      alignment: context.alignment,
    });
  };

  const goToEventSetupPage = useCallback(
    (context: EventSetupProps) => {
      const next = {
        type: PageTypes.EventSetupPage,
        context,
      };
      pushPage(next);
    },
    [pushPage],
  );

  const goToUpcomingEventsPage = useCallback(
    (context) => {
      const next = {
        type: PageTypes.UpcomingEventsPage,
        context,
      };

      pushPage(next);
    },
    [pushPage],
  );

  const goToPastEventsPage = useCallback(() => {
    const next = {
      type: PageTypes.PastEventsPage,
    };

    pushPage(next);
  }, [pushPage]);

  const goToEventDetailPage = useCallback(
    (context: EventDetailPageProps) => {
      const next = {
        type: PageTypes.EventDetailPage,
        context,
      };

      pushPage(next);
    },
    [pushPage],
  );

  const goToEventAttendeesPage = useCallback(
    (context: EventAttendeesPageProps) => {
      const next = {
        type: PageTypes.EventAttendeesPage,
        context,
      };

      pushPage(next);
    },
    [pushPage],
  );

  const goToVisitorUsageLimitPage = useCallback(() => {
    const next = {
      type: PageTypes.VisitorUsageLimitPage,
    };
    pushPage(next);
  }, [pushPage]);

  const onProductTagClick = useCallback((context: { productTag: Amity.ProductTag }) => {
    context.productTag?.product?.productUrl &&
      window.open(context.productTag.product.productUrl, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    if (currentPage.type === PageTypes.CommunityProfilePage) {
      onRouteChange?.({
        route: 'community',
        id: currentPage.context.communityId,
      });
    } else if (currentPage.type === PageTypes.UserProfilePage) {
      onRouteChange?.({ route: 'user', id: currentPage.context.userId });
    } else if (currentPage.type === PageTypes.PostDetailPage) {
      onRouteChange?.({ route: 'post', id: currentPage.context.postId });
    } else {
      onRouteChange?.({ route: '', id: undefined });
    }
  }, [currentPage]);

  return (
    <NavigationContext.Provider
      value={{
        page: currentPage,
        prevPage,
        prev2Page,
        currentClip,
        setCurrentClip,
        setDefaultPage,
        onChangePage: handleChangePage,
        onClickCategory: handleClickCategory,
        onClickCommunity: handleClickCommunity,
        onClickUser: handleClickUser,
        onCommunityCreated: handleCommunityCreated,
        onEditCommunity: handleEditCommunity,
        onMessageUser: handleMessageUser,
        onBack: handleBack,
        goToUserProfilePage,
        goToPostDetailPage,
        goToEditUserPage,
        goToSocialGlobalSearchPage,
        goToCommunityProfilePage,
        goToViewStoryPage,
        goToSelectPostTargetPage,
        goToSelectClipPostTargetPage,
        goToStoryTargetSelectionPage,
        goToSelectPollPostTargetPage,
        goToSelectEventTargetPage,
        goToStoryCreationPage,
        goToDraftClipPage,
        goToDraftStoryPage,
        goToPostComposerPage,
        goToSocialHomePage,
        goToMyCommunitiesSearchPage,
        goToAllCategoriesPage,
        goToCommunitiesByCategoryPage,
        goToCreateCommunityPage,
        goToEditCommunityPage,
        goToAddCategoryPage,
        goToAddMemberPage,
        goToInviteMemberPage,
        goToCommunitySettingPage,
        goToPostPermissionPage,
        goToStorySettingPage,
        goToPendingPostPage,
        goToMembershipPage,
        goToPendingInvitationPage,
        goToPollPostComposerPage,
        setNavigationBlocker,
        goToUserRelationshipPage,
        goToPendingFollowRequestPage,
        goToBlockedUsersPage,
        goToLiveStreamTerminatedPage,
        goToLiveStreamBannedPage,
        goToLiveStreamPlayerPage,
        goToLivestreamUnsupportedPage,
        goToCreateLivestreamPage,
        onClickStory: handleClickStory,
        goToNotificationTrayPage,
        goToPendingRequestPage,
        goToClipFeedPage,
        handleVisitorUserAction,
        handleNonMemberAction,
        handleNonFollowerAction,
        handleVisitorUsageLimitSignIn,
        goToEventSetupPage,
        goToUpcomingEventsPage,
        goToPastEventsPage,
        goToEventDetailPage,
        goToEventAttendeesPage,
        goToVisitorUsageLimitPage,
        onProductTagClick,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
