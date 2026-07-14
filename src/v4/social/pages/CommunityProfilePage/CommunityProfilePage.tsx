import React, { useEffect, useRef, useState } from 'react';
import { resolveString } from '~/v4/core/localization';
import styles from './CommunityProfilePage.module.css';
import { useAmityElement, useAmityPage } from '~/v4/core/hooks/uikit';
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
import { FileTrigger } from 'react-aria-components';
import { CommunityProfileTab } from '~/v4/social/elements/CommunityProfileTab';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { CommunityDisplayName } from '~/v4/social/elements/CommunityDisplayName';
import { PollTypeSelection } from '~/v4/social/components/PollTypeSelection';
import { CreatePollButton } from '~/v4/social/elements/CreatePollButton';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useConfig } from '~/v4/social/providers/ConfigProvider';
import { useDiscardPostCreation, useGetInvitation } from '~/v4/social/hooks';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { CreateClipButton } from '~/v4/social/elements/CreateClipButton';
import { useClipContext } from '~/v4/social/providers/ClipProvider';
import { useFeedScrollContext } from '~/v4/core/providers/FeedScrollProvider';
import { EventSetupMode } from '~/v4/social/features';
import { CreateEventButton } from '~/v4/social/elements/CreateEventButton';
import { useEventPermission } from '~/v4/social/features/events/hooks';
import { Typography } from '~/v4/core/components';
import { CommunityMediaFeed } from '~/v4/social/features/communities/profile/components/MediaFeed';
import { CommunityEventFeed } from '~/v4/social/features/communities/profile/components/EventFeed';
interface CommunityProfileProps {
  communityId: string;
  page?: number;
}

export const CommunityProfilePage: React.FC<CommunityProfileProps> = ({ communityId, page }) => {
  const pageId = 'community_profile_page';

  const { onScroll } = useFeedScrollContext();
  const { openPopup } = usePopupContext();
  const { discardPostCreation } = useDiscardPostCreation();
  const { currentUserId } = useSDK();
  const { file: clipFile, setFile: setClipFile } = useClipContext();
  const [isSticky, setIsSticky] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const profileTabRef = useRef<HTMLDivElement>(null);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { activeTab, setActiveTab } = useCommunityTabContext();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { isExcluded: isCreatePostButtonExcluded } = useAmityElement({
    pageId,
    componentId: '*',
    elementId: 'community_create_post_button',
  });
  const { socialCommunityCreationButtonVisible } = useConfig();
  const hideCreatePost = isCreatePostButtonExcluded || !socialCommunityCreationButtonVisible;

  const { community, isLoading, refresh, error } = useCommunity({
    communityId,
    shouldCall: !!communityId,
  });
  const { isLoading: isInvitationLoading } = useGetInvitation(community as Amity.Community);
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const isCommunityModerator = moderators.find((moderator) => moderator.userId === currentUserId);
  const { acceptedInvitation, linkToPost } = useLayoutContext();
  const { isDesktop } = useResponsive();
  const { hasCreateEventPermission } = useEventPermission(communityId);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'community_feed':
        return <CommunityFeed pageId={pageId} communityId={communityId} />;
      case 'community_pin':
        return <CommunityPin pageId={pageId} communityId={communityId} />;
      case 'community_event_feed':
        return <CommunityEventFeed pageId={pageId} communityId={communityId} />;
      case 'community_media_feed':
        return <CommunityMediaFeed pageId={pageId} communityId={communityId} />;
      default:
        return null;
    }
  };

  const handleTabChange = (tab: CommunityTab) => setActiveTab(tab);

  const handleRefresh = async () => setRefreshKey((prevKey) => prevKey + 1);

  const handleClipFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) setClipFile(files[0]);
    removeDrawerData();
  };

  const checkPostPermission = () => {
    const isOnlyAdminCanPost = community?.postSetting === 'ONLY_ADMIN_CAN_POST';
    return isOnlyAdminCanPost ? isCommunityModerator : !!community?.isJoined;
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
    !linkToPost && setActiveTab('community_feed');
  }, [communityId]);

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
      {isShowFailed && <FailedToShow pageId={pageId} />}
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
        !community?.isDeleted &&
        !hideCreatePost && (
          <div className={styles.communityProfilePage__poseComposer}>
            <PostComposer
              pageId={pageId}
              communityId={communityId}
              onClickEvent={() => {
                AmityCommunityProfilePageBehavior?.goToEventSetupPage?.({
                  targetId: communityId,
                  mode: EventSetupMode.CREATE,
                  targetName: community?.displayName ?? '',
                });
              }}
              onClickPost={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: ({ close }) => discardPostCreation({ pageId, onDiscard: close }),
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
                  header: (
                    <Typography.Headline>
                      {resolveString('amity_social_label_choose_poll_type')}
                    </Typography.Headline>
                  ),
                  children: ({ close }) => (
                    <PollTypeSelection
                      target={community}
                      onClickNext={close}
                      targetType="community"
                      targetId={community?.communityId as string}
                    />
                  ),
                });
              }}
            />
          </div>
        )}
      {!isShowFailed && !community?.isDeleted && <div key={refreshKey}>{renderTabContent()}</div>}
      {!isShowFailed &&
        community?.isJoined &&
        !community?.isDeleted &&
        checkPostPermission() &&
        !hideCreatePost && (
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
                          setDrawerData({
                            content: (
                              <PollTypeSelection
                                targetId={communityId}
                                targetType="community"
                                onClickNext={removeDrawerData}
                              />
                            ),
                          });
                        }}
                      />
                      {!isDesktop && (
                        <FileTrigger
                          onSelect={handleClipFileSelect}
                          acceptedFileTypes={['video/*']}
                        >
                          <CreateClipButton pageId={pageId} componentId={communityId} />
                        </FileTrigger>
                      )}
                      {hasCreateEventPermission && (
                        <CreateEventButton
                          pageId={pageId}
                          onPress={() => {
                            removeDrawerData();
                            AmityCommunityProfilePageBehavior?.goToEventSetupPage?.({
                              targetId: communityId,
                              mode: EventSetupMode.CREATE,
                              targetName: community?.displayName ?? '',
                            });
                          }}
                        />
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
