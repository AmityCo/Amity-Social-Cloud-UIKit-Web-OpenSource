import { useEffect, useState } from 'react';
import { resolveString, useString } from '~/v4/core/localization';
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
      notification.info({
        content: resolveString('amity_social_toast_community_profile_update_failed'),
      });
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
      notification.info({
        content: resolveString('amity_social_toast_community_profile_update_failed'),
      });
    } finally {
      notification.success({
        content: resolveString('amity_social_toast_community_setup_toast_update_success'),
      });
      onClickCommunity(community?.communityId);
    }
  };

  const confirmPageChange = () => {
    if (community?.postSetting !== postSetting) {
      confirm({
        title: resolveString('amity_social_modal_dialog_discard_changes_title'),
        content: resolveString('amity_social_modal_dialog_discard_changes_description'),
        onOk: () => onBack(),
        cancelText: resolveString('amity_social_button_cancel'),
        okText: resolveString('amity_social_button_ok'),
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
          {useString('amity_social_permission_community_setting_post_permission')}
        </Typography.TitleBold>
        <Button
          size="medium"
          variant="text"
          color="primary"
          isDisabled={disabled}
          onPress={handleSubmitPermission}
          className={styles.communityPostPermissionPage__mobileCta}
        >
          {useString('amity_social_button_community_setup_edit_button')}
        </Button>
      </div>
      <div className={styles.communityPostPermissionPage__communityContentWrap}>
        <div className={styles.communityPostPermissionPage__label}>
          <Typography.BodyBold>
            {useString('amity_social_label_who_can_post_on_this_community')}
          </Typography.BodyBold>
          <br />
          <Typography.Body className={styles.communityPostPermissionPage__desc}>
            {useString('amity_social_label_you_can_control_who_can_create_posts_in_your_community')}
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
              label: (
                <Typography.Body>
                  {useString('amity_social_permission_post_permission_everyone')}
                </Typography.Body>
              ),
            },
            {
              value: CommunityPostSettings.ADMIN_REVIEW_POST_REQUIRED,
              label: (
                <Typography.Body>
                  {useString('amity_social_permission_post_permission_admin_review')}
                </Typography.Body>
              ),
            },
            {
              value: CommunityPostSettings.ONLY_ADMIN_CAN_POST,
              label: (
                <Typography.Body>
                  {useString('amity_social_permission_post_permission_only_admin')}
                </Typography.Body>
              ),
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
            {resolveString('amity_social_button_community_setup_edit_button')}
          </Button>
        </div>
      </div>
    </div>
  );
};
