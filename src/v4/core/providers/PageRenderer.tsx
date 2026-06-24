import React, { Fragment, useEffect } from 'react';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import {
  CreateLivestreamPage,
  LivestreamTargetSelectionPage,
  LivestreamUnsupportedPage,
  LiveStreamPlayerPage,
  LivestreamTerminatedPage,
  LiveStreamBannedPage,
} from '~/v4/social/features/livestream/pages';
import {
  AmityDraftStoryPage,
  CommunityAddCategoryPage,
  CommunityMembershipPage,
  CommunityPostPermissionPage,
  CommunityStorySettingPage,
  NotificationTrayPage,
  AllCategoriesPage,
  CommunitiesByCategoryPage,
  BlockedUserPage,
  CommunitySetupPage,
  CommunityAddMemberPage,
  CommunityProfilePage,
  CommunitySettingPage,
  EditUserProfilePage,
  PendingPostsPage,
  MyCommunitiesSearchPage,
  PollPostComposerPage,
  PollTargetSelectionPage,
  PostComposerPage,
  PostDetailPage,
  SelectPostTargetPage,
  SocialGlobalSearchPage,
  StoryTargetSelectionPage,
  SocialHomePage,
  UserPendingFollowRequestPage,
  UserProfilePage,
  UserRelationshipPage,
  ViewStoryPage,
  CommunityInviteMemberPage,
  Mode,
  DraftClipPage,
  ClipFeedPage,
} from '~/v4/social/pages';
import { CommunityTabProvider } from '~/v4/core/providers/CommunityTabProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

type PageRendererProps = {
  children: React.JSX.Element;
};

const PageRenderer = ({ children }: PageRendererProps) => {
  const { isDesktop } = useResponsive();
  const { liveStreamPlayer } = useLayoutContext();
  const { page, setDefaultPage } = useNavigation();

  useEffect(() => {
    setDefaultPage({
      type: children.type?.displayName || children.type?.name,
      context: children?.props,
    });
  }, []);

  // modal as page
  if (liveStreamPlayer) {
    return <LiveStreamPlayerPage {...liveStreamPlayer} />;
  }

  switch (page.type) {
    case PageTypes.SocialHomePage:
      return <SocialHomePage />;
    case PageTypes.SocialGlobalSearchPage:
      return !isDesktop ? <SocialGlobalSearchPage keyword={page.context?.keyword} /> : null;
    case PageTypes.PostDetailPage:
      return (
        <PostDetailPage
          id={page.context?.postId}
          hideTarget={page.context?.hideTarget}
          category={page.context?.category}
          commentId={page.context?.commentId}
          parentId={page.context?.parentId}
          posts={page.context?.posts}
          keyword={page.context?.keyword}
          rootId={page.context?.rootId}
        />
      );
    case PageTypes.StoryTargetSelectionPage:
      return <StoryTargetSelectionPage />;
    case PageTypes.CommunityProfilePage:
      return (
        <CommunityTabProvider>
          <CommunityProfilePage communityId={page.context.communityId} page={page.context.page} />
        </CommunityTabProvider>
      );
    case PageTypes.ViewStoryPage:
      return <ViewStoryPage type={page.context.storyType} targetId={page.context?.targetId} />;
    case PageTypes.DraftPage:
      return (
        <AmityDraftStoryPage
          targetId={page.context?.targetId}
          targetType={page.context?.targetType}
          mediaType={page.context?.mediaType}
        />
      );
    case PageTypes.PostComposerPage:
      return (
        <PostComposerPage
          mode={page.context?.mode as any}
          targetId={page.context?.targetId}
          targetType={page.context?.targetType}
          community={page.context?.community}
          post={page.context?.post}
        />
      );
    case PageTypes.SelectPostTargetPage:
      return <SelectPostTargetPage />;
    case PageTypes.MyCommunitiesSearchPage:
      return <MyCommunitiesSearchPage />;
    case PageTypes.AllCategoriesPage:
      return <AllCategoriesPage />;
    case PageTypes.CommunitiesByCategoryPage:
      return <CommunitiesByCategoryPage categoryId={page.context.categoryId} />;
    case PageTypes.UserProfilePage:
      return <UserProfilePage userId={page.context.userId} />;
    case PageTypes.CommunitySetupPage:
      return <CommunitySetupPage mode={page.context?.mode} community={page.context?.community} />;
    case PageTypes.CommunityAddCategoryPage:
      return <CommunityAddCategoryPage category={page.context.categories} />;
    case PageTypes.CommunityAddMemberPage:
      return (
        <CommunityAddMemberPage
          member={page.context?.members}
          communityId={page.context?.communityId}
          onAddedAction={page.context?.onAddedAction}
        />
      );
    case PageTypes.CommunityInviteMemberPage:
      return (
        <CommunityInviteMemberPage
          onSubmit={page.context?.onSubmit}
          communityId={page.context?.communityId}
        />
      );
    case PageTypes.CommunitySettingPage:
      return <CommunitySettingPage community={page.context.community} />;
    case PageTypes.CommunityPostPermissionPage:
      return <CommunityPostPermissionPage community={page.context.community} />;
    case PageTypes.CommunityStorySettingPage:
      return <CommunityStorySettingPage community={page.context.community} />;
    case PageTypes.PendingPostsPage:
      return <PendingPostsPage communityId={page.context.communityId} />;
    case PageTypes.CommunityMembershipPage:
      return <CommunityMembershipPage community={page.context.community} />;
    case PageTypes.EditUserProfilePage:
      return <EditUserProfilePage userId={page.context.userId} />;
    case PageTypes.UserRelationshipPage:
      return (
        <UserRelationshipPage userId={page.context.userId} selectedTab={page.context.selectedTab} />
      );
    case PageTypes.UserPendingFollowRequestPage:
      return <UserPendingFollowRequestPage />;
    case PageTypes.BlockedUsersPage:
      return <BlockedUserPage />;
    case PageTypes.LiveStreamTerminatedPage:
      return <LivestreamTerminatedPage />;
    case PageTypes.LiveStreamBannedPage:
      return <LiveStreamBannedPage />;
    case PageTypes.NotificationTrayPage:
      return <NotificationTrayPage />;
    case PageTypes.CommunityFeed:
      return <Fragment>{children}</Fragment>;
    case PageTypes.CommunityEdit:
      return <Fragment>{children}</Fragment>;
    case PageTypes.PollTargetSelectionPage:
      return <PollTargetSelectionPage />;
    case PageTypes.PollPostComposerPage:
      return (
        <PollPostComposerPage
          targetId={page.context.targetId}
          targetType={page.context.targetType}
        />
      );
    case PageTypes.LiveStreamPlayerPage:
      return (
        <LiveStreamPlayerPage
          post={page.context.post}
          goToDetailPage={page.context.goToDetailPage}
        />
      );
    case PageTypes.CreateLivestreamPage:
      return (
        <CreateLivestreamPage
          targetType={page.context.targetType}
          targetId={page.context.targetId}
        />
      );
    case PageTypes.LivestreamTargetSelectionPage:
      return <LivestreamTargetSelectionPage />;
    case PageTypes.LivestreamUnsupportedPage:
      return <LivestreamUnsupportedPage />;
    case PageTypes.DraftClipPage:
      return (
        <DraftClipPage targetId={page.context.targetId} targetType={page.context.targetType} />
      );
    case PageTypes.ClipFeedPage:
      return (
        <ClipFeedPage
          currentPostId={page.context.currentPostId}
          postIndex={page.context.postIndex}
          targetId={page.context.targetId}
          targetType={page.context.targetType}
        />
      );

    default:
      return <Fragment>{children}</Fragment>;
  }
};

export default PageRenderer;
