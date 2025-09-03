import React, { useContext } from 'react';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';
import {
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
} from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { UserRelationshipPageTabs } from '~/v4/social/pages/UserRelationshipPage/UserRelationshipPage';

export interface PageBehavior {
  AmityStoryViewPageBehavior?: {
    onCloseAction?(): void;
    hyperLinkAction?(context: Record<string, unknown>): void;
  };
  AmityDraftStoryPageBehavior?: {
    closeAction?(): void;
  };
  onClickHyperLink?(): void;
  AmitySocialHomePageBehavior?: {
    goToNotificationTrayPage?: () => void;
    goToClipFeedPage?: (context: { currentPostId?: string; postIndex?: number }) => void;
  };
  AmityGlobalFeedComponentBehavior?: {
    goToPostDetailPage?: (context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
    }) => void;
    goToViewStoryPage?: (context: {
      targetId: string;
      targetType: Amity.StoryTargetType;
      storyType: 'communityFeed' | 'globalFeed';
      targetIds?: string[];
    }) => void;
    goToCreateCommunityPage?(context: { mode: AmityCommunitySetupPageMode }): void;
  };
  AmityPostDetailPageBehavior?: {
    goToClipFeedPage?: (context: {
      currentPostId?: string;
      postIndex?: number;
      targetType?: 'community' | 'user';
      targetId?: string;
    }) => void;
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
  AmitySocialGlobalSearchPageBehavior?: Record<string, unknown>;
  AmityCommunitySearchResultComponentBehavior?: {
    goToCommunityProfilePage?: (context: { communityId: string }) => void;
  };
  AmityUserSearchResultComponentBehavior?: {
    goToUserProfilePage?: (context: { userId: string }) => void;
  };
  AmityCreatePostMenuComponentBehavior?: {
    goToSelectPostTargetPage?(): void;
    goToSelectClipPostTargetPage?(context: { isClipPost: boolean }): void;
    goToStoryTargetSelectionPage?(): void;
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
  AmityStoryTargetSelectionPage?: {
    goToStoryCreationPage?(context: {
      targetId: string | null;
      targetType: Amity.StoryTargetType;
      mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
      storyType: 'communityFeed' | 'globalFeed';
    }): void;
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
    goToPostDetailPage?(context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
    }): void;
    goToStoryCreationPage?(context: {
      targetId: string | null;
      targetType: Amity.StoryTargetType;
      mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
      storyType: 'communityFeed' | 'globalFeed';
    }): void;
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
    goToStorySettingPage?(context: { community: Amity.Community }): void;
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
    goToPostDetailPage?(context: { postId: string }): void;
  };
  AmityUserProfilePageBehavior?: {
    goToEditUserPage?(context: { userId: string }): void;
    goToChangeAvatarPage?(context: {
      userId: string;
      image: Amity.File<'image'> | null;
      selectedFile?: File | null;
      pageId?: string;
      onBack?: () => void;
      onImageUploaded?: (uploadedImage: Amity.File<'image'>) => void;
    }): void;
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
    }): void;
  };
  AmityNotificationTrayPageBehavior?: {
    goToCommunityProfilePage?(context: { communityId: string }): void;
    goToPostDetailPage?(context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
      commentId?: string;
      parentId?: string;
    }): void;
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
    goToPostDetailPage?(context: {
      postId: string;
      hideTarget?: boolean;
      category?: AmityPostCategory;
      commentId?: string;
      parentId?: string;
      posts?: Amity.Post<'clip' | 'video'>[];
    }): void;
    goToUserProfilePage?(context: { userId: string }): void;
    goToCommunityProfilePage?(context: { communityId: string }): void;
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
  const {
    page,
    onBack,
    goToPostDetailPage,
    goToCommunityProfilePage,
    goToUserProfilePage,
    goToEditUserPage,
    goToChangeAvatarPage,
    goToViewStoryPage,
    onChangePage,
    goToSelectPostTargetPage,
    goToSelectClipPostTargetPage,
    goToSelectPollPostTargetPage,
    goToStoryTargetSelectionPage,
    goToStoryCreationPage,
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
    goToStorySettingPage,
    goToPendingPostPage,
    goToPollPostComposerPage,
    goToInviteMemberPage,
    goToPendingInvitationPage,
    goToPendingRequestPage,
  } = useNavigation();
  const navigationBehavior: PageBehavior = {
    AmityStoryViewPageBehavior: {
      onCloseAction: () => {
        if (pageBehavior?.AmityStoryViewPageBehavior?.onCloseAction) {
          return pageBehavior.AmityStoryViewPageBehavior.onCloseAction();
        }
        onChangePage(PageTypes.SocialHomePage);
      },
      hyperLinkAction: (context: Record<string, unknown>) => {
        if (pageBehavior?.AmityStoryViewPageBehavior?.hyperLinkAction) {
          return pageBehavior.AmityStoryViewPageBehavior.hyperLinkAction(context);
        }
      },
    },
    AmityDraftStoryPageBehavior: {
      closeAction: () => {
        if (pageBehavior?.AmityDraftStoryPageBehavior?.closeAction) {
          return pageBehavior.AmityDraftStoryPageBehavior.closeAction();
        }
        onBack();
      },
    },
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
      goToPostDetailPage: (context: {
        postId: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
      }) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context.postId, context.hideTarget, context.category);
      },
      goToViewStoryPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToViewStoryPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToViewStoryPage(context);
        }
        goToViewStoryPage({
          targetId: context.targetId,
          targetType: context.targetType,
          storyType: context.storyType,
        });
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

    AmitySocialGlobalSearchPageBehavior: {},
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
      goToStoryTargetSelectionPage() {
        if (pageBehavior?.AmityCreatePostMenuComponentBehavior?.goToStoryTargetSelectionPage) {
          return pageBehavior.AmityCreatePostMenuComponentBehavior.goToStoryTargetSelectionPage();
        }
        goToStoryTargetSelectionPage();
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
    AmityStoryTargetSelectionPage: {
      goToStoryCreationPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityStoryTargetSelectionPage?.goToStoryCreationPage) {
          return pageBehavior.AmityStoryTargetSelectionPage.goToStoryCreationPage(context);
        }
        goToStoryCreationPage(context);
      },
    },
    AmityPollTargetSelectionPageBehavior: {
      goToPollPostComposerPage: (context: {
        targetId: string | null;
        targetType: 'community' | 'user';
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
      goToPostDetailPage(context: {
        postId: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
      }) {
        if (pageBehavior?.AmityCommunityProfilePageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityCommunityProfilePageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context.postId, context.hideTarget, context.category);
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
      goToStoryCreationPage: (context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
        storyType: 'communityFeed' | 'globalFeed';
      }) => {
        if (pageBehavior?.AmityStoryTargetSelectionPage?.goToStoryCreationPage) {
          return pageBehavior.AmityStoryTargetSelectionPage.goToStoryCreationPage(context);
        }
        goToStoryCreationPage(context);
      },
      goToPollPostComposerPage: (context: {
        targetId: string | null;
        targetType: 'community' | 'user';
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
      goToStorySettingPage(context: { community: Amity.Community }) {
        if (pageBehavior?.AmityCommunitySettingPageBehavior?.goToStorySettingPage) {
          return pageBehavior.AmityCommunitySettingPageBehavior.goToStorySettingPage(context);
        }
        goToStorySettingPage?.(context.community);
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
      goToPostDetailPage(context: { postId: string }) {
        if (pageBehavior?.AmityUserFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityUserFeedComponentBehavior.goToPostDetailPage(context);
        }

        goToPostDetailPage(context.postId);
      },
    },
    AmityUserProfilePageBehavior: {
      goToEditUserPage(context: { userId: string }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToEditUserPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToEditUserPage(context);
        }

        goToEditUserPage(context.userId);
      },
      goToChangeAvatarPage(context: {
        userId: string;
        image: Amity.File<'image'> | null;
        selectedFile?: File | null;
        pageId?: string;
        onBack?: () => void;
        onImageUploaded?: (uploadedImage: Amity.File<'image'>) => void;
      }) {
        if (pageBehavior?.AmityUserProfilePageBehavior?.goToChangeAvatarPage) {
          return pageBehavior.AmityUserProfilePageBehavior.goToChangeAvatarPage(context);
        }

        goToChangeAvatarPage?.(context);
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
        goToPostDetailPage(
          context.postId,
          context.hideTarget,
          context.category,
          context.commentId,
          context.parentId,
        );
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
      goToPostDetailPage: (context: {
        postId: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
        commentId?: string;
        parentId?: string;
        posts?: Amity.Post<'clip' | 'video'>[];
      }) => {
        if (pageBehavior?.AmityClipFeedPageBehavior?.goToPostDetailPage) {
          return pageBehavior.AmityClipFeedPageBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(
          context.postId,
          context.hideTarget,
          context.category,
          context.commentId,
          context.parentId,
          context.posts,
        );
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
