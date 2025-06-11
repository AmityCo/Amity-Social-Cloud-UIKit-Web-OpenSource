import React from 'react';
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
  const { leaveCommunity, closeCommunity } = useCommunityInfo(community.communityId);
  const { confirm, info } = useConfirmContext();
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const { socialSettings } = useSocialSettings();
  const isCommunityModerator = moderators.some((moderator) => moderator.userId === currentUserId);

  const handleLeaveCommunity = () => {
    if (!online) {
      info({
        title: 'Unable to leave community',
        content: 'Something went wrong. Please try again later.',
        okText: 'OK',
      });
      return;
    }
    if (moderators.length == 1 && isCommunityModerator) {
      info({
        title: 'Unable to leave community',
        content:
          'You’re the only moderator in this group. To leave community, nominate other members to moderator role.',
        okText: 'OK',
      });
    } else {
      confirm({
        title: 'Leave community?',
        content: community?.requiresJoinApproval
          ? 'If you change your mind, you’ll have to request to join again.'
          : 'Leave the community. You will no longer be able to post and interact in this community.',
        okText: 'Leave',
        onOk: () => {
          leaveCommunity();
          onBack();
        },
      });
    }
  };

  const handleCloseCommunity = () => {
    if (!online) {
      info({
        title: 'Unable to close community',
        content: 'Something went wrong. Please try again later.',
        okText: 'OK',
      });
      return;
    }
    confirm({
      title: 'Close community?',
      content:
        'All members will be removed from the community. All posts, messages, reactions, and media shared in community will be deleted. This cannot be undone.',
      okText: 'Confirm',
      onOk: async () => {
        if (!community?.communityId) return;
        try {
          closeCommunity();
        } catch (error) {
          info({
            title: 'Unable to close community',
            content: 'Something went wrong. Please try again later.',
            okText: 'OK',
          });
        } finally {
          AmityCommunitySettingPageBehavior?.goToSocialHomePage?.();
        }
      },
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
            Community information
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
                Community permissions
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
