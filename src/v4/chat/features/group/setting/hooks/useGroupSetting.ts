import type { ComponentProps } from 'react';
import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { useChannelPushNotificationQuery, useLeaveChannelQuery } from '~/v4/chat/hooks/queries';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { getNotificationModeLabelKey } from '~/v4/chat/utils/notificationModeLabel';
import { getPersonalNotificationLabelKey } from '~/v4/chat/utils/personalNotificationLabel';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { SettingMenu } from '~/v4/chat/elements/SettingMenu';
import { PencilFilled } from '~/v4/icons/PencilFilled';
import { Bell } from '~/v4/icons/Bell';
import UserUnlock from '~/v4/icons/UserUnlock';
import { Members } from '~/v4/icons/Members';
import Banned from '~/v4/icons/Banned';
import type { GroupSettingPageProps } from '~/v4/chat/pages/GroupSettingPage';

export type SettingMenuItem = ComponentProps<typeof SettingMenu> & { key: string };

export function useGroupSetting({ channelId }: GroupSettingPageProps) {
  const { pop, push } = useChatNavigation();
  const { channel, isLoading } = useChannelObject({ channelId });
  const { membership } = useChannelMyMembership(channel);
  const { isEnabled: personalIsEnabled } = useChannelPushNotificationQuery({ channelId });
  const { confirm } = useConfirmContext();
  const { success } = useNotifications();
  const { leaveChannel } = useLeaveChannelQuery();

  const isModerator = hasModeratorRole(membership?.roles);
  const notificationLabel = useString(getNotificationModeLabelKey(channel?.notificationMode));
  const personalNotificationLabel = useString(getPersonalNotificationLabelKey(personalIsEnabled));

  const lastModTitle = useString('amity_chat_group_leave_last_mod_title');
  const lastModMessage = useString('amity_chat_group_leave_last_mod_message');
  const promoteMemberLabel = useString('amity_chat_group_promote_member');
  const cancelLabel = useString('amity_chat_cancel');
  const leaveTitle = useString('amity_chat_group_leave_confirm_title');
  const leaveMessage = useString('amity_chat_group_leave_confirm_message');
  const leaveConfirm = useString('amity_chat_group_leave_confirm_label');
  const leaveSuccessToast = useString('amity_chat_toast_group_chat_left');

  const groupProfileLabel = useString('amity_chat_group_profile');
  const groupNotificationsLabel = useString('amity_chat_group_notifications');
  const memberPermissionsLabel = useString('amity_chat_group_member_permissions');
  const allMembersLabel = useString('amity_chat_group_members_label');
  const bannedUsersLabel = useString('amity_chat_group_banned_members');
  const notificationsLabel = useString('amity_chat_notifications_title');

  function handleClose() {
    pop();
  }

  function handleOpenGroupProfile() {
    push({
      type: ChatPageTypes.EditGroupProfilePage,
      context: { channelId },
    });
  }

  function handleOpenGroupNotification() {
    push({
      type: ChatPageTypes.EditGroupNotificationPage,
      context: { channelId },
    });
  }

  function handleOpenGroupMemberPermissions() {
    push({
      type: ChatPageTypes.EditGroupMemberPermissionsPage,
      context: { channelId },
    });
  }

  function handleOpenGroupNotificationPreference() {
    push({
      type: ChatPageTypes.GroupNotificationPreferencePage,
      context: { channelId },
    });
  }

  function handleOpenAllMembers() {
    push({
      type: ChatPageTypes.GroupMemberListPage,
      context: { channelId },
    });
  }

  function handleOpenBannedMembers() {
    push({
      type: ChatPageTypes.BannedGroupMemberListPage,
      context: { channelId },
    });
  }

  function handleLeaveGroup() {
    if (!channelId) return;
    const moderatorCount = channel?.moderatorMemberCount ?? 0;
    const isLastModerator = isModerator && moderatorCount <= 1;

    if (isLastModerator) {
      confirm({
        title: lastModTitle,
        content: lastModMessage,
        okText: promoteMemberLabel,
        cancelText: cancelLabel,
        okButtonColor: 'primary',
        onOk: () => {
          push({
            type: ChatPageTypes.GroupMemberListPage,
            context: { channelId },
          });
        },
      });
      return;
    }

    confirm({
      title: leaveTitle,
      content: leaveMessage,
      okText: leaveConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await leaveChannel({ channelId });
        pop();
        pop();
        success({ content: leaveSuccessToast });
      },
    });
  }

  const groupItems: (SettingMenuItem & { visible: boolean })[] = [
    {
      key: 'group-profile',
      icon: PencilFilled,
      label: groupProfileLabel,
      onPress: handleOpenGroupProfile,
      ariaLabel: groupProfileLabel,
      visible: isModerator,
    },
    {
      key: 'group-notifications',
      icon: Bell,
      label: groupNotificationsLabel,
      trailingText: notificationLabel,
      onPress: handleOpenGroupNotification,
      ariaLabel: groupNotificationsLabel,
      visible: false,
    },
    {
      key: 'member-permissions',
      icon: UserUnlock,
      label: memberPermissionsLabel,
      onPress: handleOpenGroupMemberPermissions,
      ariaLabel: memberPermissionsLabel,
      visible: isModerator,
    },
    {
      key: 'all-members',
      icon: Members,
      label: allMembersLabel,
      onPress: handleOpenAllMembers,
      ariaLabel: allMembersLabel,
      visible: true,
    },
    {
      key: 'banned-users',
      icon: Banned,
      label: bannedUsersLabel,
      onPress: handleOpenBannedMembers,
      ariaLabel: bannedUsersLabel,
      visible: isModerator,
    },
  ];

  const preferenceItems: (SettingMenuItem & { visible: boolean })[] = [
    {
      key: 'notifications',
      icon: Bell,
      label: notificationsLabel,
      trailingText: personalNotificationLabel,
      onPress: handleOpenGroupNotificationPreference,
      ariaLabel: notificationsLabel,
      visible: false,
    },
  ];

  const visibleGroupItems = groupItems.filter((item) => item.visible);
  const visiblePreferenceItems = preferenceItems.filter((item) => item.visible);

  const title = channel?.displayName ?? '';
  const avatar = channel?.avatar;
  const isPublic = channel?.isPublic;

  return {
    isLoading,
    title,
    avatar,
    isPublic,
    handleClose,
    handleLeaveGroup,
    visibleGroupItems,
    visiblePreferenceItems,
  };
}
