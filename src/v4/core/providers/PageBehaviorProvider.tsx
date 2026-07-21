import React, { useContext } from 'react';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';
import {
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
} from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { type GoToPostDetailPageParams } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import useSDK from '~/v4/core/hooks/useSDK';

export interface PageBehavior {
  onClickHyperLink?(): void;
  AmitySocialHomePageBehavior?: {
    goToNotificationTrayPage?: () => void;
    goToClipFeedPage?: (context: { currentPostId?: string; postIndex?: number }) => void;
  };
  AmityGlobalFeedComponentBehavior?: {
    goToPostDetailPage?: (context: GoToPostDetailPageParams) => void;
    goToCreateCommunityPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
  AmityPostDetailPageBehavior?: {
    goToClipFeedPage?: (context: {
      currentPostId?: string;
      postIndex?: number;
      targetType?: 'community' | 'user';
      targetId?: string;
    }) => void;
    goToSocialGlobalSearchPage?: (context: { keyword: string }) => void;
  };
  AmityPostContentComponentBehavior?: {
    goToCommunityProfilePage?: (context: { communityId: string }) => void;
    goToUserProfilePage?: (context: { userId: string }) => void;
    goToPostComposerPage?: (context: {
      mode: Mode.EDIT;
      post: Amity.Post;
      isClipPost?: boolean;
    }) => void;
  };
  AmitySocialGlobalSearchPageBehavior?: {
    goToPostDetailPage?: (context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
      keyword?: string;
    }) => void;
  };
  AmityCommunitySearchResultComponentBehavior?: {
    goToCommunityProfilePage?: (context: { communityId: string }) => void;
  };
  AmityUserSearchResultComponentBehavior?: {
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
  AmityCreatePostMenuComponentBehavior?: {
    goToSelectPostTargetPage?(): void;
    goToSelectClipPostTargetPage?(context: { isClipPost: boolean }): void;
    goToSelectPollPostTargetPage?(): void;
  };
  AmityPostTargetSelectionPage?: {
    goToPostComposerPage?: (context: {
      mode: Mode.CREATE;
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
    }) => void;
    goToDraftClipPage?: (context: {
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
    }) => void;
  };
  AmityPostComposerPageBehavior?: {
    goToSocialHomePage?(): void;
  };
  AmityCommunityProfilePageBehavior?: {
    goToPostComposerPage?(context: {
      mode: Mode.CREATE | Mode.EDIT;
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
      post?: Amity.Post;
      isClipPost?: boolean;
    }): void;
    goToPostDetailPage?(context: GoToPostDetailPageParams): void;
    goToCommunitySettingPage?(context: { community: Amity.Community }): void;
    goToEditCommunityPage?(context: {
      mode: AmityCommunitySetupPageMode;
      community: Amity.Community;
    }): void;
    goToPendingPostPage?(context: { communityId: string }): void;
    goToMembershipPage?(context: { community: Amity.Community }): void;
    goToPollPostComposerPage?(context: {
      targetId: string | null;
      targetType: 'community' | 'user';
      pollType?: 'text' | 'image';
    }): void;
    goToPendingRequestPage?(context: { community: Amity.Community }): void;
    goToDraftClipPage?(context: {
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
    }): void;
    goToClipFeedPage?: (context: {
      currentPostId?: string;
      postIndex?: number;
      targetType?: 'community' | 'user';
      targetId?: string;
    }) => void;
  };
  AmitySocialHomeTopNavigationComponentBehavior?: {
    goToCreateCommunityPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
  AmityCommunitySetupPageBehavior?: {
    goToAddCategoryPage?(context: { categories?: Amity.Category[] }): void;
    goToAddMemberPage?(context: {
      members?: MemberCommunitySetup[];
      communityId?: string;
      onAddedAction?: (userId: string[]) => void;
    }): void;
    goToInviteMemberPage?(context: {
      communityId?: string;
      onSubmit?: (userId: string[]) => void;
    }): void;
  };
  AmityCommunitySettingPageBehavior?: {
    goToEditCommunityPage?(context: {
      mode: AmityCommunitySetupPageMode;
      community: Amity.Community;
    }): void;
    goToMembershipPage?(context: { community: Amity.Community }): void;
    goToPendingInvitationPage?(context: { community: Amity.Community }): void;
    goToPostPermissionPage?(context: { community: Amity.Community }): void;
    goToSocialHomePage?(): void;
  };
  AmityCommunityMembershipPageBehavior?: {
    goToAddMemberPage?(context: {
      members?: MemberCommunitySetup[];
      communityId?: string;
      onAddedAction?: (userId: string[]) => void;
    }): void;
    goToUserProfilePage?: (context: { userId: string }) => void;
    goToInviteMemberPage?(context: {
      communityId?: string;
      onSubmit?: (userId: string[]) => void;
    }): void;
  };
  AmityCommunityPendingInvitationPageBehavior?: {
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
  AmityCommunityInviteMemberPageBehavior?: {
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
  AmityUserFeedComponentBehavior?: {
    goToPostDetailPage?(context: GoToPostDetailPageParams): void;
  };
  AmityUserProfilePageBehavior?: {
    goToEditUserPage?(context: { userId: string }): void;
    goToBlockedUsersPage?(): void;
    goToPostComposerPage?(context: { userId: string; isClipPost?: boolean }): void;
    goToDraftClipPage?(context: {
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
    }): void;
    goToClipFeedPage?: (context: {
      currentPostId?: string;
      postIndex?: number;
      targetType?: 'community' | 'user';
      targetId?: string;
    }) => void;
  };
  AmityUserProfileHeaderComponentBehavior?: {
    goToUserRelationshipPage?(context: {
      userId: string;
      selectedTab: UserRelationshipPageTabs;
    }): void;
    goToPendingFollowRequestPage?(): void;
  };
  AmityUserRelationshipPageBehavior?: {
    goToUserProfilePage?(context: { userId: string }): void;
  };
  AmityUserPendingFollowRequestsPageBehavior?: {
    goToUserProfilePage?(context: { userId: string }): void;
  };
  AmityBlockedUsersPageBehavior?: {
    goToUserProfilePage?(context: { userId: string }): void;
  };
  AmityPollTargetSelectionPageBehavior?: {
    goToPollPostComposerPage?(context: {
      targetId: string | null;
      targetType: 'community' | 'user';
      pollType?: 'text' | 'image';
    }): void;
  };
  AmityNotificationTrayPageBehavior?: {
    goToCommunityProfilePage?(context: { communityId: string }): void;
    goToPostDetailPage?(context: GoToPostDetailPageParams): void;
    goToUserProfilePage?(context: { userId: string }): void;
    goToEditProfilePage?(): void;
  };
  AmityDraftClipPageBehavior?: {
    goToPostComposerPage?(context: {
      mode: Mode.CREATE;
      targetId: string | null;
      targetType: 'community' | 'user';
      community?: Amity.Community;
      isClipPost?: boolean;
    }): void;
  };
  AmityClipFeedPageBehavior?: {
    goToSelectClipPostTargetPage?(context: { isClipPost: boolean }): void;
    goToPostDetailPage?(context: GoToPostDetailPageParams): void;
    goToUserProfilePage?(context: { userId: string }): void;
    goToCommunityProfilePage?(context: { communityId: string }): void;
  };
  AmityGlobalBehavior?: {
    /**
     * Called when a visitor attempts a restricted action (join, comment, react,
     * follow…). The default shows a "create an account or sign in" toast;
     * override to open your own sign-in / create-profile flow.
     *
     * When the gated action is joining a community, the tapped `communityId` is
     * passed so the host can, for example, take the visitor straight into a
     * sign-in flow for that community. The UIKit also records the id internally
     * and auto-joins that community once the visitor finishes signing in.
     */
    handleVisitorUserAction?(context: {
      alignment: NotificationAlignment;
      communityId?: string;
    }): void;
    handleNonMemberAction?(context: { alignment: NotificationAlignment }): void;
    handleNonFollowerAction?(context: { alignment: NotificationAlignment }): void;
    onPostProductTagClick?(context: { product: Amity.Product }): void;
    handleVisitorUsageLimitReached?(): void;
    handleVisitorUsageLimitSignIn?(context: { alignment: NotificationAlignment }): void;
  };
  AmityMyCommunitiesComponentBehavior?: {
    goToCommunitySetupPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
}

const PageBehaviorContext = React.createContext<PageBehavior | undefined>(undefined);

interface PageBehaviorProviderProps {
  children: React.ReactNode;
  pageBehavior?: Partial<PageBehavior>;
}

export const PageBehaviorProvider: React.FC<PageBehaviorProviderProps> = ({
  children,
  pageBehavior = {},
}) => {
  const { currentUserId } = useSDK();
  const {
    page,
    goToPostDetailPage,
    goToCommunityProfilePage,
    goToUserProfilePage,
    goToEditUserPage,
    onChangePage,
    goToSelectPostTargetPage,
    goToSelectClipPostTargetPage,
    goToSelectPollPostTargetPage,
    goToPostComposerPage,
    goToDraftClipPage,
    goToClipFeedPage,
    goToSocialHomePage,
    goToUserRelationshipPage,
    goToPendingFollowRequestPage,
    goToBlockedUsersPage,
    goToAddCategoryPage,
    goToAddMemberPage,
    goToCommunitySettingPage,
    goToEditCommunityPage,
    goToMembershipPage,
    goToPostPermissionPage,
    goToPendingPostPage,
    goToPollPostComposerPage,
    goToInviteMemberPage,
    goToPendingInvitationPage,
    goToPendingRequestPage,
    goToSocialGlobalSearchPage,
    handleVisitorUserAction,
    handleNonMemberAction,
    handleNonFollowerAction,
    handleVisitorUsageLimitSignIn,
    goToCreateCommunityPage,
  } = useNavigation();
  const navigationBehavior: PageBehavior = {
    onClickHyperLink: () => {},
    AmitySocialHomePageBehavior: {
      goToNotificationTrayPage: () => {
        if (pageBehavior?.AmitySocialHomePageBehavior?.goToNotificationTrayPage) {
          return pageBehavior.AmitySocialHomePageBehavior.goToNotificationTrayPage();
        }
        onChangePage(PageTypes.NotificationTrayPage);
      },
      goToClipFeedPage: (context: { currentPostId?: string; postIndex?: number }) => {
        if (pageBehavior?.AmitySocialHomePageBehavior?.goToClipFeedPage) {
          return pageBehavior.AmitySocialHomePageBehavior.goToClipFeedPage(context);
        }
        goToClipFeedPage?.(context);
      },
    },
    AmityGlobalFeedComponentBehavior: {
      goToPostDetailPage: (context: GoToPostDetailPageParams) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
    },
    AmityPostDetailPageBehavior: {
      goToClipFeedPage: (context: {
        currentPostId?: string;
        postIndex?: number;
        targetType?: 'community' | 'user';
        targetId?: string;
      }) => {
        if (pageBehavior?.AmityPostDetailPageBehavior?.goToClipFeedPage) {
          return pageBehavior.AmityPostDetailPageBehavior.goToClipFeedPage(context);
        }
        goToClipFeedPage?.(context);
      },
      goToSocialGlobalSearchPage: (context: { keyword: string }) => {
        if (pageBehavior?.AmityPostDetailPageBehavior?.goToSocialGlobalSearchPage) {
          return pageBehavior.AmityPostDetailPageBehavior.goToSocialGlobalSearchPage(context);
        }
        goToSocialGlobalSearchPage(undefined, context.keyword);
      },
    },
    AmityPostContentComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToCommunityProfilePage(context);
        }
        goToCommunityProfilePage(context.communityId);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
      goToPostComposerPage: (context: { mode: Mode.EDIT; post: Amity.Post }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
    },

    AmitySocialGlobalSearchPageBehavior: {
      goToPostDetailPage: (context: GoToPostDetailPageParams) => {
        if (pageBehavior?.AmitySocialGlobalSearchPageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmitySocialGlobalSearchPageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
    },
    AmityCommunitySearchResultComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityCommunitySearchResultComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityCommunitySearchResultComponentBehavior.goToCommunityProfilePage(
            context,
          );
        }
        goToCommunityProfilePage(context.communityId);
      },
    },
    AmityUserSearchResultComponentBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityUserSearchResultComponentBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityUserSearchResultComponentBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityCreatePostMenuComponentBehavior: {
      goToSelectPostTargetPage() {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToSelectPostTargetPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToSelectPostTargetPage();
        }
        goToSelectPostTargetPage();
      },
      goToSelectClipPostTargetPage(context: { isClipPost: boolean }) {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToSelectClipPostTargetPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToSelectClipPostTargetPage(
            context,
          );
        }
        goToSelectClipPostTargetPage(context);
      },
      goToSelectPollPostTargetPage() {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToSelectPollPostTargetPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToSelectPollPostTargetPage();
        }
        goToSelectPollPostTargetPage();
      },
    },
    AmityPostTargetSelectionPage: {
      goToPostComposerPage: (context: {
        mode: Mode.CREATE;
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
        isClipPost?: boolean;
      }) => {
        if (pageBehavior?.AmityPostTargetSelectionPage?.goToPostComposerPage) {
          return pageBehavior.AmityPostTargetSelectionPage.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
      goToDraftClipPage(context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
      }) {
        if (pageBehavior?.AmityPostTargetSelectionPage?.goToDraftClipPage) {
          return pageBehavior.AmityPostTargetSelectionPage.goToDraftClipPage(context);
        }
        goToDraftClipPage?.(context);
      },
    },
    AmityPollTargetSelectionPageBehavior: {
      goToPollPostComposerPage: (context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        pollType?: 'text' | 'image';
      }) => {
        if (pageBehavior?.AmityPollTargetSelectionPageBehavior?.goToPollPostComposerPage) {
          return pageBehavior.AmityPollTargetSelectionPageBehavior.goToPollPostComposerPage(
            context,
          );
        }
        goToPollPostComposerPage(context);
      },
    },
    AmityPostComposerPageBehavior: {
      goToSocialHomePage() {
        if (pageBehavior?.AmityPostComposerPageBehavior?.goToSocialHomePage) {
          return pageBehavior.AmityPostComposerPageBehavior.goToSocialHomePage();
        }
        goToSocialHomePage();
      },
    },
    AmityCommunityProfilePageBehavior: {
      goToPostComposerPage(context: {
        mode: Mode.CREATE;
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
        post?: Amity.Post;
        isClipPost?: boolean;
      }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
      goToPostDetailPage(context: GoToPostDetailPageParams) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
      goToCommunitySettingPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToCommunitySettingPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToCommunitySettingPage(context);
        }
        goToCommunitySettingPage?.(context.community);
      },
      goToPendingPostPage(context: { communityId: string }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPendingPostPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPendingPostPage(context);
        }
        goToPendingPostPage?.(context.communityId);
      },
      goToMembershipPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToMembershipPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToMembershipPage(context);
        }
        goToMembershipPage?.(context.community);
      },
      goToPollPostComposerPage: (context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        pollType?: 'text' | 'image';
      }) => {
        if (pageBehavior?.AmityPollTargetSelectionPageBehavior?.goToPollPostComposerPage) {
          return pageBehavior.AmityPollTargetSelectionPageBehavior.goToPollPostComposerPage(
            context,
          );
        }
        goToPollPostComposerPage(context);
      },
      goToPendingRequestPage: (context: { community: Amity.Community }) => {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPendingRequestPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPendingRequestPage(context);
        }
        goToPendingRequestPage?.(context.community);
      },
      goToDraftClipPage: (context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
      }) => {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToDraftClipPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToDraftClipPage(context);
        }
        goToDraftClipPage?.(context);
      },
      goToClipFeedPage: (context: {
        currentPostId?: string;
        postIndex?: number;
        targetType?: 'community' | 'user';
        targetId?: string;
      }) => {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToClipFeedPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToClipFeedPage(context);
        }
        goToClipFeedPage?.(context);
      },
    },
    AmityCommunitySetupPageBehavior: {
      goToAddCategoryPage(context: { categories?: Amity.Category[] }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToAddCategoryPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToAddCategoryPage(context);
        }
        goToAddCategoryPage?.(context);
      },
      goToAddMemberPage(context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToAddMemberPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToAddMemberPage(context);
        }
        goToAddMemberPage?.(context);
      },
      goToInviteMemberPage(context: {
        communityId?: string;
        onSubmit?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToInviteMemberPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToInviteMemberPage(context);
        }
        goToInviteMemberPage?.(context);
      },
    },
    AmityCommunitySettingPageBehavior: {
      goToEditCommunityPage(context: {
        mode: AmityCommunitySetupPageMode;
        community: Amity.Community;
      }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToEditCommunityPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToEditCommunityPage(context);
        }
        goToEditCommunityPage?.({
          mode: context.mode,
          community: context.community,
        });
      },
      goToMembershipPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToMembershipPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToMembershipPage(context);
        }
        goToMembershipPage?.(context.community);
      },
      goToPendingInvitationPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToPendingInvitationPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToPendingInvitationPage(context);
        }
        goToPendingInvitationPage?.(context.community);
      },
      goToPostPermissionPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToPostPermissionPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToPostPermissionPage(context);
        }
        goToPostPermissionPage?.(context.community);
      },
      goToSocialHomePage() {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToSocialHomePage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToSocialHomePage();
        }
        goToSocialHomePage();
      },
    },
    AmityCommunityMembershipPageBehavior: {
      goToAddMemberPage(context: {
        members?: MemberCommunitySetup[];
        communityId?: string;
        onAddedAction?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunityMembershipPageBehavior?.goToAddMemberPage) {
          return pageBehavior.AmityCommunityMembershipPageBehavior.goToAddMemberPage(context);
        }
        goToAddMemberPage?.(context);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityCommunityMembershipPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityCommunityMembershipPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
      goToInviteMemberPage(context: {
        communityId?: string;
        onSubmit?: (userId: string[]) => void;
      }) {
        if (pageBehavior?.AmityCommunitySetupPageBehavior?.goToInviteMemberPage) {
          return pageBehavior.AmityCommunitySetupPageBehavior.goToInviteMemberPage(context);
        }
        goToInviteMemberPage?.(context);
      },
    },
    AmityCommunityPendingInvitationPageBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityCommunityPendingInvitationPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityCommunityPendingInvitationPageBehavior.goToUserProfilePage(
            context,
          );
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityCommunityInviteMemberPageBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityCommunityInviteMemberPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityCommunityInviteMemberPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityUserFeedComponentBehavior: {
      goToPostDetailPage(context: GoToPostDetailPageParams) {
        if (pageBehavior?.AmityUserFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityUserFeedComponentBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
    },
    AmityUserProfilePageBehavior: {
      goToEditUserPage(context: { userId: string }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToEditUserPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToEditUserPage(context);
        }

        goToEditUserPage(context.userId);
      },
      goToBlockedUsersPage() {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToBlockedUsersPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToBlockedUsersPage();
        }

        goToBlockedUsersPage();
      },
      goToPostComposerPage(context: { userId: string }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToPostComposerPage(context);
        }

        goToEditUserPage(context.userId);
      },
      goToDraftClipPage(context: { targetId: string | null; targetType: 'community' | 'user' }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToDraftClipPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToDraftClipPage(context);
        }
        goToDraftClipPage?.(context);
      },
      goToClipFeedPage(context: {
        currentPostId?: string;
        postIndex?: number;
        targetType?: 'community' | 'user';
        targetId?: string;
      }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToClipFeedPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToClipFeedPage(context);
        }
        goToClipFeedPage?.(context);
      },
    },
    AmityUserProfileHeaderComponentBehavior: {
      goToUserRelationshipPage(context: { userId: string; selectedTab: UserRelationshipPageTabs }) {
        if (pageBehavior?.AmityUserProfileHeaderComponentBehavior?.goToUserRelationshipPage) {
          return pageBehavior.AmityUserProfileHeaderComponentBehavior.goToUserRelationshipPage(
            context,
          );
        }

        goToUserRelationshipPage(context.userId, context.selectedTab);
      },
      goToPendingFollowRequestPage() {
        if (pageBehavior?.AmityUserProfileHeaderComponentBehavior?.goToPendingFollowRequestPage) {
          return pageBehavior.AmityUserProfileHeaderComponentBehavior.goToPendingFollowRequestPage();
        }
        goToPendingFollowRequestPage();
      },
    },
    AmityUserRelationshipPageBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityUserRelationshipPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityUserRelationshipPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityUserPendingFollowRequestsPageBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityUserPendingFollowRequestsPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityUserPendingFollowRequestsPageBehavior.goToUserProfilePage(
            context,
          );
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityBlockedUsersPageBehavior: {
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityBlockedUsersPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityBlockedUsersPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmityNotificationTrayPageBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityNotificationTrayPageBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityNotificationTrayPageBehavior.goToCommunityProfilePage(context);
        }
        goToCommunityProfilePage(context.communityId);
      },
      goToPostDetailPage: (context: {
        postId: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
        commentId?: string;
        parentId?: string;
      }) => {
        if (pageBehavior?.AmityNotificationTrayPageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityNotificationTrayPageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityNotificationTrayPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityNotificationTrayPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
      goToEditProfilePage: () => {
        if (pageBehavior?.AmityNotificationTrayPageBehavior?.goToEditProfilePage) {
          return pageBehavior.AmityNotificationTrayPageBehavior.goToEditProfilePage();
        }

        if (currentUserId) goToEditUserPage(currentUserId);
      },
    },
    AmityDraftClipPageBehavior: {
      goToPostComposerPage: (context: {
        mode: Mode.CREATE;
        targetId: string | null;
        targetType: 'community' | 'user';
        community?: Amity.Community;
        isClipPost?: boolean;
      }) => {
        if (pageBehavior?.AmityDraftClipPageBehavior?.goToPostComposerPage) {
          return pageBehavior.AmityDraftClipPageBehavior.goToPostComposerPage(context);
        }
        goToPostComposerPage(context);
      },
    },
    AmityClipFeedPageBehavior: {
      goToSelectClipPostTargetPage(context: { isClipPost: boolean }) {
        if (pageBehavior?.AmityClipFeedPageBehavior?.goToSelectClipPostTargetPage) {
          return pageBehavior.AmityClipFeedPageBehavior.goToSelectClipPostTargetPage(context);
        }
        goToSelectClipPostTargetPage(context);
      },
      goToPostDetailPage: (context: GoToPostDetailPageParams) => {
        if (pageBehavior?.AmityClipFeedPageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityClipFeedPageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityClipFeedPageBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityClipFeedPageBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityClipFeedPageBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityClipFeedPageBehavior.goToCommunityProfilePage(context);
        }
        goToCommunityProfilePage(context.communityId);
      },
    },
    AmityGlobalBehavior: {
      handleVisitorUserAction: (context: {
        alignment: NotificationAlignment;
        communityId?: string;
      }) => {
        if (pageBehavior?.AmityGlobalBehavior?.handleVisitorUserAction) {
          return pageBehavior?.AmityGlobalBehavior?.handleVisitorUserAction(context);
        }
        handleVisitorUserAction(context);
      },
      handleNonMemberAction: (context: { alignment: NotificationAlignment }) => {
        if (pageBehavior?.AmityGlobalBehavior?.handleNonMemberAction) {
          return pageBehavior?.AmityGlobalBehavior?.handleNonMemberAction(context);
        }
        handleNonMemberAction(context);
      },

      handleNonFollowerAction: (context: { alignment: NotificationAlignment }) => {
        if (pageBehavior?.AmityGlobalBehavior?.handleNonFollowerAction) {
          return pageBehavior?.AmityGlobalBehavior?.handleNonFollowerAction(context);
        }
        handleNonFollowerAction(context);
      },
      onPostProductTagClick: (context: { product: Amity.Product }) => {
        if (pageBehavior?.AmityGlobalBehavior?.onPostProductTagClick) {
          return pageBehavior.AmityGlobalBehavior.onPostProductTagClick(context);
        }
        context.product?.productUrl &&
          window.open(context.product.productUrl, '_blank', 'noopener,noreferrer');
      },
      handleVisitorUsageLimitReached: () => {
        if (pageBehavior?.AmityGlobalBehavior?.handleVisitorUsageLimitReached) {
          return pageBehavior.AmityGlobalBehavior.handleVisitorUsageLimitReached();
        }
        // Default: no-op here — state is driven from AmityUIKitProvider via onVisitorUsageLimitReached callback
      },
      handleVisitorUsageLimitSignIn: (context: { alignment: NotificationAlignment }) => {
        if (pageBehavior?.AmityGlobalBehavior?.handleVisitorUsageLimitSignIn) {
          return pageBehavior.AmityGlobalBehavior.handleVisitorUsageLimitSignIn(context);
        }
        handleVisitorUsageLimitSignIn(context);
      },
    },
    AmityMyCommunitiesComponentBehavior: {
      goToCommunitySetupPage: (context: { mode: AmityCommunitySetupPageMode }) => {
        if (pageBehavior?.AmityMyCommunitiesComponentBehavior?.goToCommunitySetupPage) {
          return pageBehavior.AmityMyCommunitiesComponentBehavior.goToCommunitySetupPage(context);
        }
        goToCreateCommunityPage?.(context);
      },
    },
  };

  return (
    <PageBehaviorContext.Provider value={navigationBehavior}>
      {children}
    </PageBehaviorContext.Provider>
  );
};

export const usePageBehavior = () => {
  const pageBehavior = useContext(PageBehaviorContext);
  if (!pageBehavior) {
    throw new Error('usePageBehavior must be used within a PageBehaviorProvider');
  }
  return pageBehavior;
};
