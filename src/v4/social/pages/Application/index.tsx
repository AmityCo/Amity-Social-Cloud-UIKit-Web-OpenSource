import React, { useEffect, useState } from 'react';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import CommunityFeed from '~/social/pages/CommunityFeed';
import { Breadcrumb } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { CommunityTabProvider } from '~/v4/core/providers/CommunityTabProvider';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { CommunitySideBar } from '~/v4/social/components/CommunitySideBar';
import { MainLayout } from '~/v4/social/layouts/Main';
import { AllCategoriesPage } from '~/v4/social/pages/AllCategoriesPage';
import { BlockedUserPage } from '~/v4/social/pages/BlockedUserPage/BlockedUserPage';
import { ChangeAvatarPage } from '~/v4/social/pages/ChangeAvatarPage';
import { CommunitiesByCategoryPage } from '~/v4/social/pages/CommunitiesByCategoryPage';
import { CommunityAddMemberPage } from '~/v4/social/pages/CommunityAddMemberPage/CommunityAddMemberPage';
import { CommunityInviteMemberPage } from '~/v4/social/pages/CommunityInviteMemberPage';
import { CommunityPendingInvitationPage } from '~/v4/social/pages/CommunityPendingInvitationPage';
import { CommunityProfilePage } from '~/v4/social/pages/CommunityProfilePage';
import { CommunitySettingPage } from '~/v4/social/pages/CommunitySettingPage';
import { CommunitySetupPage } from '~/v4/social/pages/CommunitySetupPage';
import { EditUserProfilePage } from '~/v4/social/pages/EditUserProfilePage';
import { LiveStreamPlayerPage } from '~/v4/social/pages/LiveStreamPlayerPage';
import { LivestreamTerminatedPage } from '~/v4/social/pages/LivestreamTerminatedPage';
import { MyCommunitiesSearchPage } from '~/v4/social/pages/MyCommunitiesSearchPage/MyCommunitiesSearchPage';
import { PendingPostsPage } from '~/v4/social/pages/PendingPostsPage';
import { PollPostComposerPage } from '~/v4/social/pages/PollPostComposerPage';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';
import { PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { PostDetailPage } from '~/v4/social/pages/PostDetailPage';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import SettingPage from '~/v4/social/pages/SettingPage/SettingPage';
import { SocialGlobalSearchPage } from '~/v4/social/pages/SocialGlobalSearchPage';
import { SocialHomePage } from '~/v4/social/pages/SocialHomePage';
import { ViewStoryPage } from '~/v4/social/pages/StoryPage';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import { UserPendingFollowRequestPage } from '~/v4/social/pages/UserPendingFollowRequestPage/UserPendingFollowRequestPage';
import { UserProfilePage } from '~/v4/social/pages/UserProfilePage';
import { UserRelationshipPage } from '~/v4/social/pages/UserRelationshipPage';
import {
  AmityDraftStoryPage,
  ChatPage,
  ClipFeedPage,
  CommunityAddCategoryPage,
  CommunityMembershipPage,
  CommunityPostPermissionPage,
  CommunityStorySettingPage,
  DraftClipPage,
  NotificationTrayPage,
  PendingRequestPage,
} from '..';
import { UserProfileHeader } from '../../components';
import styles from './Application.module.css';
import { LiveStreamBannedPage } from '~/v4/social/pages/LiveStreamBannedPage';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

const Application = ({
  userId,
  redirectToUserProfile,
}: {
  userId?: string;
  redirectToUserProfile?: boolean;
}) => {
  const { isDesktop } = useResponsive();
  const [open, setOpen] = useState(false);
  const { page, goToSocialHomePage, goToUserProfilePage } = useNavigation();
  const { liveStreamPlayer } = useLayoutContext();
  const toggleOpen = () => setOpen((open) => !open);

  useEffect(() => {
    // Se redirectToUserProfile è true e abbiamo un userId, naviga al profilo utente
    if (redirectToUserProfile && userId) {
      goToUserProfilePage(userId);
    }
  }, [redirectToUserProfile, userId, goToUserProfilePage]);

  useEffect(() => {
    if (
      isDesktop &&
      (page.type === PageTypes.SocialGlobalSearchPage ||
        page.type === PageTypes.PostComposerPage ||
        page.type === PageTypes.SelectPostTargetPage)
    ) {
      goToSocialHomePage();
    }
  }, [isDesktop]);

  return (
    <div className={styles.applicationContainer}>
      <MainLayout
        aside={
          <>
            <Breadcrumb maxItems={3} />
            <CommunitySideBar />
          </>
        }
      >
        {page.type === PageTypes.SocialHomePage && <SocialHomePage />}
        {page.type === PageTypes.SocialGlobalSearchPage && !isDesktop && <SocialGlobalSearchPage />}
        {page.type === PageTypes.PostDetailPage &&
          (() => {
            const { postId, ...rest } = page.context || {};
            // change only postId to be id and pass the rest context fields as props
            return <PostDetailPage id={postId} {...rest} />;
          })()}
        {page.type === PageTypes.StoryTargetSelectionPage && <StoryTargetSelectionPage />}
        {page.type === PageTypes.CommunityProfilePage && (
          <CommunityTabProvider>
            <CommunityProfilePage communityId={page.context.communityId} page={page.context.page} />
          </CommunityTabProvider>
        )}
        {page.type === PageTypes.ViewStoryPage && (
          <ViewStoryPage type={page.context.storyType} targetId={page.context?.targetId} />
        )}
        {page.type === PageTypes.DraftPage && (
          <AmityDraftStoryPage
            targetId={page.context?.targetId}
            targetType={page.context?.targetType}
            mediaType={page.context?.mediaType}
          />
        )}
        {page.type === PageTypes.PostComposerPage && (
          <PostComposerPage
            mode={page.context?.mode as any}
            targetId={page.context?.targetId}
            targetType={page.context?.targetType}
            community={page.context?.community}
            post={page.context?.post}
            isClipPost={page.context?.isClipPost}
          />
        )}
        {page.type === PageTypes.SelectPostTargetPage && (
          <SelectPostTargetPage isClipPost={page.context?.isClipPost} />
        )}
        {page.type === PageTypes.MyCommunitiesSearchPage && <MyCommunitiesSearchPage />}
        {page.type === PageTypes.AllCategoriesPage && <AllCategoriesPage />}
        {page.type === PageTypes.CommunitiesByCategoryPage && (
          <CommunitiesByCategoryPage categoryId={page.context.categoryId} />
        )}
        {page.type === PageTypes.UserProfilePage && (
          <UserProfilePage userId={page.context.userId} />
        )}
        {page.type === PageTypes.CommunitySetupPage && (
          <CommunitySetupPage mode={page.context?.mode} community={page.context?.community} />
        )}
        {page.type === PageTypes.CommunityAddCategoryPage && (
          <CommunityAddCategoryPage category={page.context.categories} />
        )}
        {page.type === PageTypes.CommunityAddMemberPage && (
          <CommunityAddMemberPage
            member={page.context?.members}
            communityId={page.context?.communityId}
            onAddedAction={page.context?.onAddedAction}
          />
        )}
        {page.type === PageTypes.CommunityInviteMemberPage && (
          <CommunityInviteMemberPage
            onSubmit={page.context?.onSubmit}
            communityId={page.context?.communityId}
          />
        )}
        {page.type === PageTypes.CommunitySettingPage && (
          <CommunitySettingPage community={page.context.community} />
        )}
        {page.type === PageTypes.CommunityPostPermissionPage && (
          <CommunityPostPermissionPage community={page.context.community} />
        )}
        {page.type === PageTypes.CommunityStorySettingPage && (
          <CommunityStorySettingPage community={page.context.community} />
        )}
        {page.type === PageTypes.PendingPostsPage && (
          <PendingPostsPage communityId={page.context.communityId} />
        )}
        {page.type === PageTypes.CommunityMembershipPage && (
          <CommunityMembershipPage community={page.context.community} />
        )}
        {page.type === PageTypes.CommunityPendingInvitationPage && (
          <CommunityPendingInvitationPage community={page.context.community} />
        )}
        {page.type === PageTypes.EditUserProfilePage && (
          <EditUserProfilePage userId={page.context.userId} />
        )}
        {page.type === PageTypes.ChangeAvatarPage && (
          <ChangeAvatarPage
            userId={page.context.userId}
            image={page.context.selectedFile || null}
            pageId={page.context.pageId || 'change_avatar_page'}
            onBack={page.context.onBack}
            onImageUploaded={page.context.onImageUploaded}
          />
        )}
        {page.type === PageTypes.UserRelationshipPage && (
          <UserRelationshipPage
            userId={page.context.userId}
            selectedTab={page.context.selectedTab}
          />
        )}
        {page.type === PageTypes.UserPendingFollowRequestPage && <UserPendingFollowRequestPage />}
        {page.type === PageTypes.BlockedUsersPage && <BlockedUserPage />}
        {page.type === PageTypes.SettingPage && <SettingPage />}
        {page.type === PageTypes.LiveStreamTerminatedPage && <LivestreamTerminatedPage />}
        {page.type === PageTypes.LiveStreamBannedPage && <LiveStreamBannedPage />}
        {page.type === PageTypes.NotificationTrayPage && <NotificationTrayPage />}
        {page.type === PageTypes.PendingRequestPage && (
          <PendingRequestPage community={page.context.community} />
        )}
        {page.type === PageTypes.ChatPage && <ChatPage />}

        {/* modal as page */}
        {liveStreamPlayer && <LiveStreamPlayerPage {...liveStreamPlayer} />}

        {/* V3 */}
        {page.type === PageTypes.CommunityFeed && (
          <CommunityFeed
            communityId={page.context.communityId}
            isNewCommunity={page.context.isNewCommunity}
            isOpen={open}
            toggleOpen={toggleOpen}
          />
        )}
        {page.type === PageTypes.CommunityEdit && (
          <CommunityEditPage communityId={page.context.communityId} tab={page.context.tab} />
        )}
        {page.type === PageTypes.PollTargetSelectionPage && <PollTargetSelectionPage />}
        {page.type === PageTypes.PollPostComposerPage && (
          <PollPostComposerPage
            targetId={page.context.targetId}
            targetType={page.context.targetType}
            pollType={page.context.pollType}
          />
        )}
        {page.type === PageTypes.DraftClipPage && (
          <DraftClipPage
            targetId={page.context.targetId}
            targetType={page.context.targetType}
            community={page.context.community}
          />
        )}
        {page.type === PageTypes.ClipFeedPage && (
          <ClipFeedPage
            currentPostId={page.context.currentPostId}
            postIndex={page.context.postIndex}
            targetType={page.context.targetType}
            targetId={page.context.targetId}
          />
        )}
        {/*End of V3 */}
      </MainLayout>
    </div>
  );
};

export default Application;
