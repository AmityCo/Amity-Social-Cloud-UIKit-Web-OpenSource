import React, { useEffect, useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { CommunityRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CommunityPostSettings } from '@amityco/ts-sdk';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './CommunityPostPermissionPage.module.css';
import { useNetworkState } from 'react-use';

type CommunityPostPermissionPageProps = {
  community: Amity.Community;
};

//TODO: check needApprovalOnPostCreation and onlyAdminCanPost after postSetting fix from SDK

export const CommunityPostPermissionPage = ({ community }: CommunityPostPermissionPageProps) => {
  const pageId = 'community_post_permission_page';

  const { confirm } = useConfirmContext();
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { onBack, onClickCommunity } = useNavigation();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  const defaultPostSetting = community.postSetting
    ? community.postSetting
    : (community as Amity.Community & { needApprovalOnPostCreation?: boolean })
          .needApprovalOnPostCreation
      ? CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED
      : (community as Amity.Community & { onlyAdminCanPost?: boolean }).onlyAdminCanPost
        ? CommunityPostSettings.ONLY_ADMIN_CAN_POST
        : CommunityPostSettings.ANYONE_CAN_POST;

  const [postSetting, setPostSetting] =
    useState<ValueOf<typeof CommunityPostSettings>>(defaultPostSetting);

  useEffect(() => {
    setPostSetting(defaultPostSetting);
  }, [defaultPostSetting]);

  const handleSubmitPermission = async () => {
    if (!online) {
      notification.info({ content: 'Failed to update community profile.' });
      return;
    }

    let payload;

    if (postSetting === CommunityPostSettings.ONLY_ADMIN_CAN_POST) {
      payload = { postSetting: CommunityPostSettings.ONLY_ADMIN_CAN_POST };
    } else if (postSetting === CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED) {
      payload = { postSetting: CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED };
    } else {
      payload = { postSetting: CommunityPostSettings.ANYONE_CAN_POST };
    }
    try {
      await CommunityRepository.updateCommunity(community?.communityId, payload);
    } catch (error) {
      notification.info({ content: 'Failed to update community profile.' });
    } finally {
      notification.success({ content: 'Successfully updated community profile.' });
      onClickCommunity(community?.communityId);
    }
  };

  const confirmPageChange = () => {
    if (community?.postSetting !== postSetting) {
      confirm({
        title: 'Discard changes',
        content: 'Are you sure you want to discard changes?',
        onOk: () => onBack(),
      });
    } else {
      onBack();
    }
  };

  const disabled = defaultPostSetting === postSetting;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityPostPermissionPage__container}
    >
      <div className={styles.communityPostPermissionPage__communityTitleWrap}>
        <BackButton onPress={confirmPageChange} />
        <Typography.TitleBold className={styles.communityPostPermissionPage__communityTitle}>
          Post permissions
        </Typography.TitleBold>
        <Button
          size="medium"
          variant="text"
          color="primary"
          isDisabled={disabled}
          onPress={handleSubmitPermission}
          className={styles.communityPostPermissionPage__mobileCta}
        >
          Save
        </Button>
      </div>
      <div className={styles.communityPostPermissionPage__communityContentWrap}>
        <div className={styles.communityPostPermissionPage__label}>
          <Typography.BodyBold>Who can post on this community</Typography.BodyBold>
          <br />
          <Typography.Body className={styles.communityPostPermissionPage__desc}>
            You can control who can create posts in your community.
          </Typography.Body>
        </div>
        <RadioGroup
          value={postSetting}
          className={styles.communityPostPermissionPage__radioGroup}
          radioProps={{ className: styles.communityPostPermissionPage__choice }}
          onChange={(value) => setPostSetting(value as ValueOf<typeof CommunityPostSettings>)}
          radios={[
            {
              value: CommunityPostSettings.ANYONE_CAN_POST,
              label: <Typography.Body>Everyone can post</Typography.Body>,
            },
            {
              value: CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED,
              label: <Typography.Body>Admin review post</Typography.Body>,
            },
            {
              value: CommunityPostSettings.ONLY_ADMIN_CAN_POST,
              label: <Typography.Body>Only admins can post</Typography.Body>,
            },
          ]}
        />
        <div className={styles.communityPostPermissionPage__desktopCtaWrapper}>
          <Button
            size="medium"
            variant="fill"
            color="primary"
            isDisabled={disabled}
            onPress={handleSubmitPermission}
            className={styles.communityPostPermissionPage__desktopCta}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
