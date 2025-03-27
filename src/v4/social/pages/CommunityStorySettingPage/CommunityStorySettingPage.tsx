import React, { useState } from 'react';
import { Label } from 'react-aria-components';
import { Typography } from '~/v4/core/components';
import { BackButton } from '~/v4/social/elements';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CommunityRepository } from '@amityco/ts-sdk';
import { Switch } from '~/v4/core/components/AriaSwitch';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './CommunityStorySettingPage.module.css';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useNetworkState } from 'react-use';

type CommunityStorySettingPageProps = {
  community: Amity.Community;
};

export const CommunityStorySettingPage = ({ community }: CommunityStorySettingPageProps) => {
  const pageId = 'community_story_permission_page';
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { onBack } = useNavigation();
  const { info } = useConfirmContext();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const [isSelected, setIsSelected] = useState(community?.allowCommentInStory);

  const handleToggleChange = async (selected: boolean) => {
    if (!online) {
      notification.info({
        content: 'Failed to update community story permissions. Please try again.',
      });
      return;
    }
    setIsSelected(selected);
    try {
      await CommunityRepository.updateCommunity(community?.communityId, {
        storySetting: { enableComment: selected },
      });
    } catch (error) {
      notification.info({
        content: 'Failed to update community story permissions. Please try again.',
      });
    }
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityStorySettingPage__container}
    >
      <div className={styles.communityStorySettingPage__communityTitleWrap}>
        <BackButton onPress={() => onBack()} />
        <Typography.TitleBold className={styles.communityStorySettingPage__communityTitle}>
          Story comments
        </Typography.TitleBold>
        <div className={styles.communityStorySettingPage__emptyDiv} />
      </div>
      <div className={styles.communityStorySettingPage__wrapLabel}>
        <Label>
          <Typography.BodyBold className={styles.communityStorySettingPage__labelText}>
            Allow comments on community stories
          </Typography.BodyBold>
          <Typography.Caption className={styles.communityStorySettingPage__description}>
            Turn on to receive comments on stories in this community.
          </Typography.Caption>
        </Label>
        <Switch
          data-testid={pageId}
          onChange={handleToggleChange}
          isSelected={isSelected ?? true}
        />
      </div>
    </div>
  );
};
