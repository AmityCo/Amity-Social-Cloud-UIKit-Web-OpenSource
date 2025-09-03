import React, { Fragment, useEffect, useState } from 'react';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
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
  ChangeAvatarPage,
  LiveStreamPlayerPage,
  LivestreamTerminatedPage,
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
import CommunityFeed from '~/social/pages/CommunityFeed';
import CommunityEditPage from '~/social/pages/CommunityEdit';
import { CommunityTabProvider } from '~/v4/core/providers/CommunityTabProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

type PageRendererProps = {
  children: React.JSX.Element;
};

const PageRenderer = ({ children }: PageRendererProps) => {
  const { isDesktop } = useResponsive();
  const [open, setOpen] = useState(false);
  const { liveStreamPlayer } = useLayoutContext();
  const { page, setDefaultPage } = useNavigation();
  const toggleOpen = () => setOpen((open) => !open);

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
      return !isDesktop ? <SocialGlobalSearchPage /> : null;
    case PageTypes.PostDetailPage:
      return (
        <PostDetailPage
          id={page.context?.postId}
          hideTarget={page.context?.hideTarget}
          category={page.context?.category}
          commentId={page.context?.commentId}
          parentId={page.context?.parentId}
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
    case PageTypes.ChangeAvatarPage:
      return (
        <ChangeAvatarPage
          userId={page.context.userId}
          image={page.context.selectedFile || null}
          pageId={page.context.pageId || 'change_avatar_page'}
          onBack={page.context.onBack}
          onImageUploaded={page.context.onImageUploaded}
        />
      );
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
    case PageTypes.NotificationTrayPage:
      return <NotificationTrayPage />;
    case PageTypes.CommunityFeed:
      return (
        <CommunityFeed
          communityId={page.context.communityId}
          isNewCommunity={page.context.isNewCommunity}
          isOpen={open}
          toggleOpen={toggleOpen}
        />
      );
    case PageTypes.CommunityEdit:
      return <CommunityEditPage communityId={page.context.communityId} tab={page.context.tab} />;
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
