import React, { useEffect } from 'react';
import { SocialHomePage } from '~/v4/social/pages/SocialHomePage';
import { PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { PostDetailPage } from '~/v4/social/pages/PostDetailPage';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { SocialGlobalSearchPage } from '~/v4/social/pages/SocialGlobalSearchPage';
import { ViewStoryPage } from '~/v4/social/pages/StoryPage';
import { SelectPostTargetPage } from '~/v4/social/pages/SelectPostTargetPage';
import { MyCommunitiesSearchPage } from '~/v4/social/pages/MyCommunitiesSearchPage/MyCommunitiesSearchPage';
import styles from './Application.module.css';
import {
  AmityDraftStoryPage,
  ClipFeedPage,
  CommunityAddCategoryPage,
  CommunityMembershipPage,
  CommunityPostPermissionPage,
  CommunityStorySettingPage,
  DraftClipPage,
  EventAttendeesPage,
  EventDetailPage,
  NotificationTrayPage,
  PastEventsPage,
  PendingRequestPage,
  UpcomingEventsPage,
} from '..';
import { StoryTargetSelectionPage } from '~/v4/social/pages/StoryTargetSelectionPage';
import { UserProfilePage } from '~/v4/social/pages/UserProfilePage';
import { EditUserProfilePage } from '~/v4/social/pages/EditUserProfilePage';
import { CommunityProfilePage } from '~/v4/social/pages/CommunityProfilePage';
import { CommunityTabProvider } from '~/v4/core/providers/CommunityTabProvider';
import { AllCategoriesPage } from '~/v4/social/pages/AllCategoriesPage';
import { CommunitiesByCategoryPage } from '~/v4/social/pages/CommunitiesByCategoryPage';
import { MainLayout } from '~/v4/social/layouts/Main';
import { CommunitySideBar } from '~/v4/social/components/CommunitySideBar';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { UserRelationshipPage } from '~/v4/social/pages/UserRelationshipPage';
import { UserPendingFollowRequestPage } from '~/v4/social/pages/UserPendingFollowRequestPage/UserPendingFollowRequestPage';
import { BlockedUserPage } from '~/v4/social/pages/BlockedUserPage/BlockedUserPage';
import { CommunitySetupPage } from '~/v4/social/pages/CommunitySetupPage';
import { CommunityAddMemberPage } from '~/v4/social/pages/CommunityAddMemberPage/CommunityAddMemberPage';
import { CommunitySettingPage } from '~/v4/social/pages/CommunitySettingPage';
import { PendingPostsPage } from '~/v4/social/pages/PendingPostsPage';
import { PollTargetSelectionPage } from '~/v4/social/pages/PollTargetSelectionPage';
import { PollPostComposerPage } from '~/v4/social/pages/PollPostComposerPage';
import {
  CreateLivestreamPage,
  LivestreamTerminatedPage,
  LiveStreamBannedPage,
  LiveStreamPlayerPage,
  LivestreamTargetSelectionPage,
  LivestreamUnsupportedPage,
} from '~/v4/social/features/livestream/pages';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { CommunityInviteMemberPage } from '~/v4/social/pages/CommunityInviteMemberPage';
import { CommunityPendingInvitationPage } from '~/v4/social/pages/CommunityPendingInvitationPage';
import {
  EventTargetSelectionPage,
  EventSetupPage,
  EventPostTargetSelectionPage,
} from '~/v4/social/pages';
import { VisitorUsageLimitPage } from '~/v4/social/pages/VisitorUsageLimitPage';

const Application = () => {
  const { isDesktop } = useResponsive();
  const { page, goToSocialHomePage, handleVisitorUsageLimitSignIn } = useNavigation();
  const { liveStreamPlayer } = useLayoutContext();

  useEffect(() => {
    if (
      isDesktop &&
      (page.type === PageTypes.SocialGlobalSearchPage ||
        page.type === PageTypes.PostComposerPage ||
        page.type === PageTypes.SelectPostTargetPage ||
        page.type === PageTypes.EventPostTargetSelectionPage)
    ) {
      goToSocialHomePage();
    }
  }, [isDesktop]);

  if (page.type === PageTypes.VisitorUsageLimitPage) {
    return (
      <div className={styles.applicationContainer}>
        <VisitorUsageLimitPage
          onSignIn={() => handleVisitorUsageLimitSignIn({ alignment: 'fixed' })}
        />
      </div>
    );
  }

  return (
    <div className={styles.applicationContainer}>
      <MainLayout aside={<CommunitySideBar />}>
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
            targetName={page.context?.targetName}
            event={page.context?.event}
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
        {page.type === PageTypes.UserRelationshipPage && (
          <UserRelationshipPage
            userId={page.context.userId}
            selectedTab={page.context.selectedTab}
          />
        )}
        {page.type === PageTypes.UserPendingFollowRequestPage && <UserPendingFollowRequestPage />}
        {page.type === PageTypes.BlockedUsersPage && <BlockedUserPage />}
        {page.type === PageTypes.CreateLivestreamPage && <CreateLivestreamPage {...page.context} />}
        {page.type === PageTypes.LivestreamTargetSelectionPage && <LivestreamTargetSelectionPage />}
        {page.type === PageTypes.LiveStreamTerminatedPage && <LivestreamTerminatedPage />}
        {page.type === PageTypes.LivestreamUnsupportedPage && <LivestreamUnsupportedPage />}
        {page.type === PageTypes.LiveStreamBannedPage && <LiveStreamBannedPage />}
        {page.type === PageTypes.NotificationTrayPage && <NotificationTrayPage />}
        {page.type === PageTypes.PendingRequestPage && (
          <PendingRequestPage community={page.context.community} />
        )}

        {/* modal as page */}
        {liveStreamPlayer && <LiveStreamPlayerPage {...liveStreamPlayer} />}

        {page.type === PageTypes.EventTargetSelectionPage && <EventTargetSelectionPage />}
        {page.type === PageTypes.EventPostTargetSelectionPage && (
          <EventPostTargetSelectionPage event={page.context.event} />
        )}
        {page.type === PageTypes.EventSetupPage && <EventSetupPage {...page.context} />}
        {page.type === PageTypes.UpcomingEventsPage && <UpcomingEventsPage {...page.context} />}
        {page.type === PageTypes.PastEventsPage && <PastEventsPage />}
        {page.type === PageTypes.EventDetailPage && <EventDetailPage {...page.context} />}
        {page.type === PageTypes.EventAttendeesPage && <EventAttendeesPage {...page.context} />}

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
      </MainLayout>
    </div>
  );
};

export default Application;
