import React from 'react';
import { useString } from '~/v4/core/localization';
import styles from './EmptyFeed.module.css';
import { BackButton } from '~/v4/social/elements';
import { CreateNewClipButton } from '~/v4/social/elements/CreateNewClipButton';
import { IconComponent } from '~/v4/core/IconComponent';
import { EmptyFeed as EmptyFeedIcon } from '~/v4/icons/EmptyFeed';
import { ExploreCommunitiesButton } from '~/v4/social/elements/ExploreCommunitiesButton';
import { CreateCommunityButton } from '~/v4/social/elements/CreateCommunityButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';
import { Typography } from '~/v4/core/components';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

type EmptyFeedProps = {
  pageId?: string;
  componentId?: string;
  onClickBack?: () => void;
  onPressCreateNewClip?: () => void;
  isVisitorOrBot?: boolean;
};

export const EmptyFeed = ({
  pageId = '*',
  componentId = '*',
  onClickBack,
  onPressCreateNewClip,
  isVisitorOrBot = false,
}: EmptyFeedProps) => {
  const { goToCreateCommunityPage, goToSocialHomePage } = useNavigation();
  const { setActiveTab } = useLayoutContext();

  return (
    <div className={styles.emptyFeed__container}>
      <div className={styles.emptyFeed__header}>
        <BackButton
          pageId={pageId}
          onPress={onClickBack}
          defaultClassName={styles.emptyFeed__backButton}
        />
        {!isVisitorOrBot && <CreateNewClipButton pageId={pageId} onClick={onPressCreateNewClip} />}
      </div>

      <div className={styles.emptyFeed__content}>
        <IconComponent
          imgIcon={() => <EmptyFeedIcon className={styles.emptyFeed__emptyIcon} />}
          defaultIcon={() => <EmptyFeedIcon className={styles.emptyFeed__emptyIcon} />}
        />

        <Typography.TitleBold className={styles.emptyFeed__textWhite}>
          {useString('amity_social_empty_state_social_home_empty_title')}
        </Typography.TitleBold>
        <Typography.Body className={styles.emptyFeed__textWhite}>
          {useString('amity_social_label_find_community_or_create_your_own')}
        </Typography.Body>

        <ExploreCommunitiesButton
          pageId={pageId}
          componentId={componentId}
          className={styles.emptyFeed__exploreCommunitiesButton}
          onClick={() => {
            isVisitorOrBot
              ? setActiveTab(HomePageTab.Communities)
              : setActiveTab(HomePageTab.Explore);
            goToSocialHomePage?.();
          }}
        />
        {!isVisitorOrBot && (
          <CreateCommunityButton
            pageId={pageId}
            componentId={componentId}
            onClick={() => goToCreateCommunityPage?.({ mode: AmityCommunitySetupPageMode.CREATE })}
            textClassName={styles.emptyFeed__createCommunityButtonText}
          />
        )}
      </div>
    </div>
  );
};
