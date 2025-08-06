import React, { useEffect, useRef, useState } from 'react';
import styles from './UserProfilePage.module.css';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { BackButton } from '~/v4/social/elements/BackButton';
import { UserMenu } from '~/v4/social/internal-components/UserMenu';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { UserProfileHeader } from '~/v4/social/components/UserProfileHeader';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { UserFeedTabButton } from '~/v4/social/elements/UserFeedTabButton/UserFeedTabButton';
import { UserImageFeedTabButton } from '~/v4/social/elements/UserImageFeedTabButton/UserImageFeedTabButton';
import { UserVideoFeedTabButton } from '~/v4/social/elements/UserVideoFeedTabButton/UserVideoFeedTabButton';
import { PullToRefresh } from '~/v4/core/components/PullToRefresh';
import { UserFeed } from '~/v4/social/components/UserFeed/UserFeed';
import { UserImageFeed } from '~/v4/social/components/UserImageFeed/UserImageFeed';
import { UserVideoFeed } from '~/v4/social/components/UserVideoFeed/UserVideoFeed';
import { Typography } from '~/v4/core/components';
import { PostComposer } from '~/v4/social/components/PostComposer';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton/FloatingActionButton';
import { Plus } from '~/v4/icons/Plus';
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import { Popover } from '~/v4/core/components/AriaPopover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { PollPostComposerPage } from '~/v4/social/pages/PollPostComposerPage/PollPostComposerPage';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useFeedScrollContext } from '~/v4/core/providers/FeedScrollProvider';

type UserProfilePageProps = {
  userId: string;
};

const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId }) => {
  const pageId = 'user_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();
  const initialLoad = useRef(true);

  const { onScroll, scrollPosition } = useFeedScrollContext();
  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { onBack } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { openPopup } = usePopupContext();

  const isCurrentUser = user?.userId === currentUserId;

  useEffect(() => {
    if (!containerRef.current) return;

    if (scrollPosition > 0) {
      // Use scrollTo for more reliable scroll positioning
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'auto',
      });
    }

    const timer = setTimeout(() => {
      initialLoad.current = false;
    }, 100);
    return () => clearTimeout(timer);
  }, [containerRef.current]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!initialLoad.current) {
      onScroll(event);
    }

    // Handle isScroll state for sticky header
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      if (scrollPosition > 0) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    }
  };

  const [isScroll, setIsScroll] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    UserProfileTabs.FEED,
  );

  const onChangeTab = (tab: UserProfileTabs) => {
    setCurrentActiveTab(tab);
  };

  const renderTabContent = () => {
    console.log('tab', currentActiveTab);
    if (currentActiveTab === UserProfileTabs.FEED) {
      return (
        <>
          {isCurrentUser && (
            <PostComposer
              pageId={pageId}
              onClickPost={() => {
                openPopup({
                  pageId,
                  view: 'desktop',
                  isDismissable: false,
                  onClose: onCloseCreatePostPopup,
                  header: CreatePostHeader,
                  children: (
                    <PostComposerPage mode={Mode.CREATE} targetType="user" targetId={null} />
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
                  children: <PollPostComposerPage targetId={null} targetType="user" />,
                });
              }}
            />
          )}
          <UserFeed pageId={pageId} userId={userId} />
        </>
      );
    } else if (currentActiveTab === UserProfileTabs.IMAGE) {
      return <UserImageFeed pageId={pageId} userId={userId} />;
    } else if (currentActiveTab === UserProfileTabs.VIDEO) {
      return <UserVideoFeed pageId={pageId} userId={userId} />;
    }
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
    <Typography.Headline className={styles.userProfilePage__createPostHeader}>
      My Timeline
    </Typography.Headline>
  );

  return (
    <>
      <PullToRefresh className={styles.userProfilePage} style={themeStyles}>
        <div
          className={styles.userProfilePage__container}
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className={styles.userProfilePage__topSection}>
            <div className={styles.userProfilePage__topBar}>
              <BackButton pageId={pageId} onPress={() => onBack()} />
              <Typography.TitleBold
                className={styles.userProfilePage__displayName}
                data-show={isScroll}
              >
                {user?.displayName}
              </Typography.TitleBold>
              <Popover
                trigger={{
                  pageId,
                  onClick: ({ closePopover }) =>
                    setDrawerData({
                      content: (
                        <UserMenu
                          user={user}
                          onCloseMenu={() => {
                            closePopover();
                            removeDrawerData();
                          }}
                        />
                      ),
                    }),
                }}
              >
                {({ closePopover }) => (
                  <UserMenu
                    user={user}
                    onCloseMenu={() => {
                      closePopover();
                      removeDrawerData();
                    }}
                  />
                )}
              </Popover>
            </div>
            <UserProfileHeader user={user} pageId={pageId} />

            <div className={styles.userProfilePage__feedTabs}>
              <UserFeedTabButton
                pageId={pageId}
                isActive={currentActiveTab === UserProfileTabs.FEED}
                onClick={() => onChangeTab(UserProfileTabs.FEED)}
              />
              <UserImageFeedTabButton
                pageId={pageId}
                isActive={currentActiveTab === UserProfileTabs.IMAGE}
                onClick={() => onChangeTab(UserProfileTabs.IMAGE)}
              />
              <UserVideoFeedTabButton
                pageId={pageId}
                isActive={currentActiveTab === UserProfileTabs.VIDEO}
                onClick={() => onChangeTab(UserProfileTabs.VIDEO)}
              />
            </div>
          </div>

          {renderTabContent()}
        </div>
      </PullToRefresh>
      {!isDesktop && isCurrentUser && (
        <FloatingActionButton
          icon={Plus}
          className={styles.userProfilePage__floatingButton}
          onPress={() =>
            setDrawerData({
              content: (
                <FloatingActionButtonMenu userId={userId} onPressMenu={() => removeDrawerData()} />
              ),
            })
          }
        />
      )}
    </>
  );
};
