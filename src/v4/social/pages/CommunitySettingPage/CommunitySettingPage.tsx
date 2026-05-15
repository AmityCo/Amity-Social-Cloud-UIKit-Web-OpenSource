import React from 'react';
import { resolveString, useString } from '~/v4/core/localization';
import styles from './CommunitySettingPage.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { EditProfile } from '~/v4/social/elements/EditProfile';
import { BackButton, PendingInvitations } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import { Members } from '~/v4/social/elements/Members';
import { PostPermission } from '~/v4/social/elements/PostPermission';
import { StorySetting } from '~/v4/social/elements/StorySetting';
import { LeaveCommunity } from '~/v4/social/elements/LeaveCommunity';
import { CloseCommunity } from '~/v4/social/elements/CloseCommunity';
import { CloseCommunityDescription } from '~/v4/social/elements/CloseCommunityDescription';
import { useSDK } from '~/v4/core/hooks/useSDK';
import {
  checkDeleteCommunityPermission,
  checkEditCommunityPermission,
  checkReviewPostPermission,
} from '~/v4/social/utils';
import { Button } from '~/v4/core/natives/Button';
import { useCommunityInfo } from '~/v4/social/hooks';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { AmityCommunitySetupPageMode } from '~/v4/social/pages/CommunitySetupPage';
import { useNetworkState } from 'react-use';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import { MembershipAcceptanceTypeEnum } from '@amityco/ts-sdk';
import { useCommunityActions } from '~/v4/social/hooks/useCommunityActions';

type CommunitySettingPageProps = {
  community: Amity.Community;
};

export const CommunitySettingPage = ({ community }: CommunitySettingPageProps) => {
  const pageId = 'community_setting_page';
  const { accessibilityId, themeStyles } = useAmityPage({
    pageId,
  });
  const { onBack, goToEditCommunityPage } = useNavigation();
  const { AmityCommunitySettingPageBehavior } = usePageBehavior();
  const { online } = useNetworkState();

  const { client, currentUserId } = useSDK();
  const { closeCommunity } = useCommunityInfo(community.communityId);
  const { leaveCommunity } = useCommunityActions();
  const { confirm, info } = useConfirmContext();
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const { socialSettings } = useSocialSettings();

  const isCommunityModerator = moderators.some((moderator) => moderator.userId === currentUserId);

  const leaveCommunityErrorTitle = resolveString('amity_social_button_leave_community_error_title');
  const somethingWentWrong = resolveString('amity_social_modal_dialog_something_went_wrong');
  const okText = resolveString('amity_social_button_ok');
  const moderatorOnlyLeaveError = resolveString(
    'amity_social_button_moderator_leave_community_error_msg',
  );
  const leaveCommunityTitle = resolveString('amity_social_modal_dialog_title_leave_community');
  const leaveCommunityContent = resolveString('amity_social_modal_dialog_banned_from_community');
  const leaveText = resolveString('amity_social_modal_dialog_leave_button');
  const closeCommunityErrorTitle = resolveString('amity_social_error_close_community_error_title');
  const closeCommunityTitle = resolveString('amity_social_modal_dialog_title_close_community');
  const closeCommunityContent = resolveString('amity_social_close_community_msg');
  const confirmText = resolveString('amity_social_button_confirm');
  const cancelText = resolveString('amity_social_button_cancel');
  const communityInfoTitle = resolveString('amity_social_label_community_information_title');
  const communityPermissionsTitle = resolveString(
    'amity_social_permission_community_permission_title',
  );

  const handleLeaveCommunity = () => {
    if (!online) {
      info({
        title: leaveCommunityErrorTitle,
        content: somethingWentWrong,
        okText: okText,
      });
      return;
    }
    if (moderators.length == 1 && isCommunityModerator) {
      info({
        title: leaveCommunityErrorTitle,
        content: moderatorOnlyLeaveError,
        okText: okText,
      });
    } else {
      confirm({
        title: leaveCommunityTitle,
        content: leaveCommunityContent,
        okText: leaveText,
        onOk: () => {
          leaveCommunity(community);
          onBack();
        },
        cancelText: cancelText,
      });
    }
  };

  const handleCloseCommunity = () => {
    if (!online) {
      info({
        title: closeCommunityErrorTitle,
        content: somethingWentWrong,
        okText: okText,
      });
      return;
    }
    confirm({
      title: closeCommunityTitle,
      content: closeCommunityContent,
      okText: confirmText,
      onOk: async () => {
        if (!community?.communityId) return;
        try {
          closeCommunity();
        } catch (error) {
          info({
            title: closeCommunityErrorTitle,
            content: somethingWentWrong,
            okText: okText,
          });
        } finally {
          AmityCommunitySettingPageBehavior?.goToSocialHomePage?.();
        }
      },
      cancelText: cancelText,
    });
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communitySettingPage__container}
    >
      <div className={styles.communitySettingPage__communityTitleWrap}>
        <BackButton onPress={() => onBack()} />
        <Typography.TitleBold className={styles.communitySettingPage__communityTitle}>
          {community?.displayName}
        </Typography.TitleBold>
        <div />
      </div>
      <div className={styles.communitySettingPage__content}>
        <div className={styles.communitySettingPage__basicInfoWrap}>
          <Typography.TitleBold className={styles.communitySettingPage__basicInfo}>
            {communityInfoTitle}
          </Typography.TitleBold>
          {checkEditCommunityPermission(client, community?.communityId) && (
            <EditProfile
              pageId={pageId}
              onClick={() =>
                goToEditCommunityPage?.({
                  mode: AmityCommunitySetupPageMode.EDIT,
                  community: community as Amity.Community,
                })
              }
            />
          )}
          <Members
            pageId={pageId}
            onClick={() => AmityCommunitySettingPageBehavior?.goToMembershipPage?.({ community })}
          />
          {socialSettings?.membershipAcceptance === MembershipAcceptanceTypeEnum.INVITATION &&
            isCommunityModerator && (
              <PendingInvitations
                pageId={pageId}
                onPress={() =>
                  AmityCommunitySettingPageBehavior?.goToPendingInvitationPage?.({
                    community,
                  })
                }
              />
            )}
        </div>
        {(checkReviewPostPermission(client, community?.communityId) ||
          checkEditCommunityPermission(client, community?.communityId) ||
          checkDeleteCommunityPermission(client, community?.communityId)) && (
          <div className={styles.communitySettingPage__communityPermissionWrap}>
            {
              <Typography.TitleBold className={styles.communitySettingPage__communityPermissions}>
                {communityPermissionsTitle}
              </Typography.TitleBold>
            }
            {checkReviewPostPermission(client, community?.communityId) && (
              <PostPermission
                pageId={pageId}
                onClick={() => {
                  AmityCommunitySettingPageBehavior?.goToPostPermissionPage?.({ community });
                }}
              />
            )}
            {checkEditCommunityPermission(client, community?.communityId) && (
              <StorySetting
                pageId={pageId}
                onClick={() => {
                  AmityCommunitySettingPageBehavior?.goToStorySettingPage?.({ community });
                }}
              />
            )}
          </div>
        )}
        {community?.isJoined && (
          <LeaveCommunity pageId={pageId} onClick={() => handleLeaveCommunity()} />
        )}
        {checkDeleteCommunityPermission(client, community?.communityId) && (
          <Button onPress={handleCloseCommunity}>
            <CloseCommunity pageId={pageId} />
            <CloseCommunityDescription pageId={pageId} />
          </Button>
        )}
      </div>
    </div>
  );
};
