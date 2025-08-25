import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './CommunityProfilePage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CommunityHeader } from '~/v4/social/components/CommunityHeader';
import { CommunityFeed } from '~/v4/social/components/CommunityFeed';
import { CommunityProfileSkeleton } from '~/v4/social/pages/CommunityProfilePage/CommunityProfilePageSkeleton';
import { CommunityTab, useCommunityTabContext } from '~/v4/core/providers/CommunityTabProvider';
import { CommunityPin } from '~/v4/social/components/CommunityPin';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { CommunityCreatePostButton } from '~/v4/social/elements/CommunityCreatePostButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CreatePostButton } from '~/v4/social/elements/CreatePostButton';
import { CreateStoryButton } from '~/v4/social/elements/CreateStoryButton';
import { useStoryContext } from '~/v4/social/providers/StoryProvider';
import { FileTrigger } from 'react-aria-components';
import { CommunityImageFeed } from '~/v4/social/components/CommunityImageFeed';
import { CommunityVideoFeed } from '~/v4/social/components/CommunityVideoFeed';
import { CommunityProfileTab } from '~/v4/social/elements/CommunityProfileTab';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { PollPostComposerPage } from '~/v4/social/pages/PollPostComposerPage/PollPostComposerPage';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import { useStoryPermission } from '~/v4/social/hooks/useStoryPermission';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useGetInvitation } from '~/v4/social/hooks';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { useFeedScrollContext } from '~/v4/core/providers/FeedScrollProvider';

interface CommunityProfileProps {
  communityId: string;
  page?: number;
}

export const CommunityProfilePage: React.FC<CommunityProfileProps> = ({ communityId, page }) => {
  const pageId = 'community_profile_page';

  const { onScroll, scrollPosition } = useFeedScrollContext();
  const { openPopup } = usePopupContext();
  const { confirm } = useConfirmContext();
  const { currentUserId } = useSDK();
  const { file, setFile } = useStoryContext();
  const { file: clipFile, setFile: setClipFile } = useClipContext();
  const [isSticky, setIsSticky] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileTabRef = useRef<HTMLDivElement>(null);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { activeTab, setActiveTab } = useCommunityTabContext();
  const { hasStoryPermission } = useStoryPermission(communityId);
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { community, isLoading, refresh, error } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });
  const { invitation, isLoading: isInvitationLoading } = useGetInvitation(
    community as Amity.Community,
  );
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const isCommunityModerator = moderators.find((moderator) => moderator.userId === currentUserId);
  const { onBack } = useNavigation();
  const { acceptedInvitation } = useLayoutContext();
  const { isDesktop } = useResponsive();
  const initialLoad = useRef(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community_feed':
        return <CommunityFeed pageId={pageId} communityId={communityId} />;
      case 'community_pin':
        return <CommunityPin pageId={pageId} communityId={communityId} />;
      case 'community_image_feed':
        return <CommunityImageFeed pageId={pageId} communityId={communityId} />;
      case 'community_video_feed':
        return <CommunityVideoFeed pageId={pageId} communityId={communityId} />;
      default:
        return null;
    }
  };

  const handleTabChange = (tab: CommunityTab) => setActiveTab(tab);

  const handleRefresh = async () => setRefreshKey((prevKey) => prevKey + 1);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) setFile(files[0]);
    removeDrawerData();
  };

  const handleClipFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) setClipFile(files[0]);
    removeDrawerData();
  };

  const checkPostPermission = () => {
    const isOnlyAdminCanPost = community?.postSetting === 'ONLY_ADMIN_CAN_POST';
    return isOnlyAdminCanPost ? isCommunityModerator : !!community?.isJoined;
  };

  const onCloseCreatePostPopup = ({ close }: { close: () => void }) => {
    confirm({
      onOk: close,
      type: 'confirm',
      okText: 'Discard',
      cancelText: 'Keep editing',
      title: 'Discard this post?',
      pageId: 'post_composer_page',
      content: 'The post will be permanently discarded. It cannot be undone.',
    });
  };

  const CreatePostHeader = (
    <CommunityDisplayName
      pageId="post_composer_page"
      community={community as Amity.Community}
      className={styles.communityProfilePage__createPostHeader}
    />
  );

  useEffect(() => {
    refresh();
    handleRefresh();
  }, []);

  useEffect(() => {
    if (acceptedInvitation) {
      refresh();
      handleRefresh();
    }
  }, [acceptedInvitation]);

  useEffect(() => {
    if (file) {
      AmityCommunityProfilePageBehavior?.goToStoryCreationPage?.({
        targetId: communityId,
        targetType: 'community',
        mediaType:
          file && file?.type.includes('image')
            ? { type: 'image', url: URL.createObjectURL(file) }
            : { type: 'video', url: URL.createObjectURL(file!) },
        storyType: 'communityFeed',
      });
    }
  }, [file]);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current && profileTabRef.current) {
        const scrollPosition = containerRef.current.scrollTop;
        setIsSticky(scrollPosition > profileTabRef.current.offsetTop - 90);
      }
    };

    const container = containerRef.current;

    if (container) container.addEventListener('scroll', handleScroll);

    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (clipFile) {
      AmityCommunityProfilePageBehavior?.goToDraftClipPage?.({
        targetId: communityId,
        targetType: 'community',
        community: community as Amity.Community,
      });
    }
  }, [clipFile]);

  const isShowFailed = (!isLoading && community?.isDeleted) || error;

  return (
    <PullToRefresh
      ref={containerRef}
      style={themeStyles}
      accessibilityId={accessibilityId}
      onTouchEndCallback={handleRefresh}
      className={styles.communityProfilePage__container}
      onScroll={onScroll}
    >
      {(isLoading || isInvitationLoading) && <CommunityProfileSkeleton />}
      {isShowFailed && <FailedToShow pageId={pageId} onBack={onBack} />}
      {!isLoading && !isShowFailed && !isInvitationLoading && community && !community.isDeleted && (
        <>
          <CommunityHeader pageId={pageId} community={community} isSticky={isSticky} page={page} />
          <CommunityProfileTab
            pageId={pageId}
            ref={profileTabRef}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </>
      )}
      {!isShowFailed &&
        activeTab === 'community_feed' &&
        checkPostPermission() &&
        !community?.isDeleted && (
          <div className={styles.communityProfilePage__poseComposer}>
            <PostComposer
              pageId={pageId}
              communityId={communityId}
              onSelectFile={handleFileSelect}
              onClickPost={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: onCloseCreatePostPopup,
                  header: CreatePostHeader,
                  children: (
                    <PostComposerPage
                      mode={Mode.CREATE}
                      targetType="community"
                      community={community as Amity.Community}
                      targetId={community?.communityId as string}
                    />
                  ),
                });
              }}
              onClickPoll={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: onCloseCreatePostPopup,
                  header: CreatePostHeader,
                  children: (
                    <PollPostComposerPage
                      targetId={community?.communityId as string}
                      targetType="community"
                    />
                  ),
                });
              }}
            />
          </div>
        )}
      {!isShowFailed && !community?.isDeleted && <div key={refreshKey}>{renderTabContent()}</div>}
      {!isShowFailed && community?.isJoined && !community?.isDeleted && checkPostPermission() && (
        <div className={styles.communityProfilePage__createPostButton}>
          <CommunityCreatePostButton
            pageId={pageId}
            onPress={() =>
              setDrawerData({
                content: (
                  <>
                    <CreatePostButton
                      pageId={pageId}
                      onClick={() => {
                        AmityCommunityProfilePageBehavior?.goToPostComposerPage?.({
                          mode: Mode.CREATE,
                          targetId: communityId,
                          targetType: 'community',
                          community: community as Amity.Community,
                        });
                        removeDrawerData();
                      }}
                    />
                    <CreatePollButton
                      pageId={pageId}
                      componentId={communityId}
                      onClick={() => {
                        AmityCommunityProfilePageBehavior?.goToPollPostComposerPage?.({
                          targetId: communityId,
                          targetType: 'community',
                        });
                        removeDrawerData();
                      }}
                    />
                    {hasStoryPermission && (
                      <FileTrigger onSelect={handleFileSelect}>
                        <CreateStoryButton pageId={pageId} />
                      </FileTrigger>
                    )}
                    {!isDesktop && (
                      <FileTrigger onSelect={handleClipFileSelect} acceptedFileTypes={['video/*']}>
                        <CreateClipButton pageId={pageId} componentId={communityId} />
                      </FileTrigger>
                    )}
                  </>
                ),
              })
            }
          />
        </div>
      )}
    </PullToRefresh>
  );
};
