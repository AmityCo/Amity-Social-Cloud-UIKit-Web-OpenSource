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
import { Button, Typography } from '~/v4/core/components';
import { FloatingActionButton } from '~/v4/core/components/FloatingActionButton/FloatingActionButton';
import { Plus } from '~/v4/icons/Plus';
import Pencil from '~/v4/icons/Pencil';
import { FloatingActionButtonMenu } from './FloatingActionButtonMenu/FloatingActionButtonMenu';
import useSDK from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';

type UserProfilePageProps = {
  userId: string;
  userBadgeTitle?: string;
};

const enum UserProfileTabs {
  FEED = 'feed',
  IMAGE = 'image',
  VIDEO = 'video',
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId, userBadgeTitle }) => {
  const pageId = 'user_profile_page';
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDesktop } = useResponsive();

  const { themeStyles } = useAmityPage({ pageId });
  const { user } = useUser({ userId });
  const { onBack } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId } = useSDK();
  const { confirm } = useConfirmContext();
  const { openPopup } = usePopupContext();
  const { AmityUserProfilePageBehavior } = usePageBehavior();

  const isCurrentUser = user?.userId === currentUserId;

  const [isScroll, setIsScroll] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = React.useState<UserProfileTabs>(
    UserProfileTabs.FEED,
  );

  const onChangeTab = (tab: UserProfileTabs) => {
    setCurrentActiveTab(tab);
  };

  const renderTabContent = () => {
    if (currentActiveTab === UserProfileTabs.FEED) {
      return <UserFeed pageId={pageId} userId={userId} />;
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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollPosition = containerRef.current.scrollTop;

        if (scrollPosition > 0) {
          setIsScroll(true);
        } else {
          setIsScroll(false);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  const onEditProfile = () => {
    if (user?.userId) {
      AmityUserProfilePageBehavior?.goToEditUserPage?.({ userId: user.userId });
    }
  };

  const renderActivityTabs = () => {
    return (
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
    );
  };

  return (
    <>
      <PullToRefresh className={styles.userProfilePage} style={themeStyles}>
        <div className={styles.userProfilePage__container} ref={containerRef}>
          <div className={styles.userProfilePage__topSection}>
            <div className={styles.userProfilePage__topBar}>
              <BackButton pageId={pageId} onPress={() => onBack()} />
              <Typography.TitleBold
                className={styles.userProfilePage__displayName}
                data-show={isScroll}
              >
                {user?.displayName}
              </Typography.TitleBold>
              {isCurrentUser && (
                <Button
                  data-testid={`${pageId}/'*'/edit_user_profile_button`}
                  className={styles.userMenu__button}
                  onClick={onEditProfile}
                >
                  <Pencil className={styles.userMenu__editProfile__icon} />
                </Button>
              )}
            </div>
            <UserProfileHeader user={user} pageId={pageId} userBadgeTitle={userBadgeTitle} />

            {renderActivityTabs()}
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
