import React, { useState } from 'react';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { BackButton } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Typography } from '~/v4/core/components';
import { Plus } from '~/v4/icons/Plus';
import { Button } from '~/v4/core/natives/Button';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useCommunitySetupContext } from '~/v4/social/providers/CommunitySetupProvider';
import { MemberList } from '~/v4/social/internal-components/MemberList';
import { CommunityRepository, MembershipAcceptanceTypeEnum } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { ModeratorList } from '~/v4/social/internal-components/ModeratorList';
import { useSDK } from '~/v4/core/hooks/useSDK';
import useUser from '~/core/hooks/useUser';
import useModerator from '~/v4/social/hooks/useModerator';
import { SecondaryTab } from '~/v4/core/components/SecondaryTab';
import { Key } from 'react-aria';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { CommunityAddMemberPage, CommunityInviteMemberPage } from '~/v4/social/pages';
import { useNetworkState } from 'react-use';
import useSocialSettings from '~/v4/social/hooks/useSocialSettings';
import styles from './CommunityMembershipPage.module.css';

type CommunityMembershipPageProps = {
  community: Amity.Community;
};

export const CommunityMembershipPage = ({ community }: CommunityMembershipPageProps) => {
  const pageId = 'community_membership_page';

  const { onBack } = useNavigation();
  const { currentUserId } = useSDK();
  const user = useUser(currentUserId);
  const { online } = useNetworkState();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const notification = useNotifications();
  const { socialSettings } = useSocialSettings();
  const { members } = useCommunitySetupContext();
  const { AmityCommunityMembershipPageBehavior } = usePageBehavior();
  const [activeTab, setActiveTab] = useState<Key>('members');
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { hasModeratorPermissions } = useModerator({ community, user });

  const isInvitation =
    socialSettings?.membershipAcceptance === MembershipAcceptanceTypeEnum.INVITATION;

  const onClickAddMember = async (
    userIds: Parameters<typeof CommunityRepository.Membership.addMembers>[1],
  ) => {
    if (community.communityId == null) return;

    if (!community.isJoined || !hasModeratorPermissions) {
      return notification.error({ content: 'Failed to add members to this community' });
    }

    try {
      await CommunityRepository.Membership.addMembers(community.communityId, userIds);
      notification.success({ content: 'Successfully added members to this community!' });
    } catch (err) {
      notification.error({ content: 'Failed to add members to this community. Please try again.' });
    }
  };

  const onClickInviteMember = async (userIds: string[]) => {
    if (community.communityId == null) return;

    if (!community.isJoined || !hasModeratorPermissions) {
      return notification.error({ content: 'Failed to invite members to this community' });
    }

    if (!online) {
      return notification.info({ content: 'No internet connection.' });
    }

    try {
      await community.createInvitations(userIds);
      notification.success({ content: 'Successfully invited members to this community.' });
    } catch (err) {
      notification.error({ content: 'Failed to invite members. Please try again.' });
    }
  };

  const tabs = [
    {
      label: 'Members',
      value: 'members',
      content: () => <MemberList pageId={pageId} community={community} />,
    },
    {
      label: 'Moderators',
      value: 'moderators',
      content: () => <ModeratorList pageId={pageId} community={community} />,
    },
  ];

  const openAddMemberPage = () => {
    if (isDesktop) {
      openPopup({
        children: ({ close }) => (
          <CommunityAddMemberPage
            member={members}
            closePopup={close}
            onAddedAction={onClickAddMember}
            communityId={community.communityId}
          />
        ),
      });
    } else {
      AmityCommunityMembershipPageBehavior?.goToAddMemberPage?.({
        members,
        onAddedAction: onClickAddMember,
        communityId: community.communityId,
      });
    }
  };

  const openInviteMemberPage = () => {
    if (isDesktop) {
      openPopup({
        id: 'community_invite_member_page',
        children: (
          <CommunityInviteMemberPage
            onSubmit={onClickInviteMember}
            communityId={community.communityId}
          />
        ),
      });
    } else {
      AmityCommunityMembershipPageBehavior?.goToInviteMemberPage?.({
        onSubmit: onClickInviteMember,
        communityId: community.communityId,
      });
    }
  };

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.communityMembershipPage}
    >
      <div className={styles.communityMembershipPage__topBar}>
        <BackButton onPress={() => onBack()} />
        <Typography.TitleBold className={styles.communityMembershipPage__title}>
          All members
        </Typography.TitleBold>
        <Button
          className={styles.communityMembershipPage__addMemberButton}
          onPress={() => (isInvitation ? openInviteMemberPage() : openAddMemberPage())}
        >
          <Plus className={styles.communityMembershipPage__plusIcon} />
        </Button>
      </div>
      <SecondaryTab
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        labelClassName={styles.communityMembershipPage__tabLabel}
        tabListClassName={styles.communityMembershipPage__tabList}
      />
    </div>
  );
};
