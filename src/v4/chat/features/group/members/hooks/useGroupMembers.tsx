import type { ComponentType, SVGProps } from 'react';
import { UserRepository } from '@amityco/ts-sdk';
import { useChannelObject, useChannelMyMembership } from '~/v4/chat/hooks/objects';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { Menu } from '~/v4/core/components/Menu';
import { TrashIcon } from '~/v4/icons/Trash';
import UserShield from '~/v4/icons/UserShield';
import Banned from '~/v4/icons/Banned';
import Muted from '~/v4/icons/Muted';
import UnMuted from '~/v4/icons/UnMutedOutlined';
import Flag from '~/v4/icons/Flag';
import UnFlag from '~/v4/icons/UnFlag';
import {
  useChannelBanQuery,
  useChannelMemberMuteQuery,
  useChannelMembershipQuery,
  useChannelModerationQuery,
  useUserReportQuery,
} from '~/v4/chat/hooks/queries';
import type { GroupMemberListPageProps } from '~/v4/chat/pages/GroupMemberListPage';

export type OpenMemberActionsParams = {
  user: Amity.User;
  isTargetModerator: boolean;
  isTargetMuted: boolean;
};

type MemberActionItem = {
  key: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  destructive?: boolean;
  onPress: () => void;
  visible: boolean;
};

export function useGroupMembers({ channelId }: GroupMemberListPageProps) {
  const { pop, push } = useChatNavigation();
  const { currentUserId } = useSDK();
  const { channel } = useChannelObject({ channelId });
  const { membership } = useChannelMyMembership(channel);
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { confirm } = useConfirmContext();
  const { success } = useNotifications();
  const { promoteModerator, demoteModerator } = useChannelModerationQuery();
  const { removeMembers } = useChannelMembershipQuery();
  const { banUser } = useChannelBanQuery();
  const { mute, unmute } = useChannelMemberMuteQuery();
  const { report, unreport } = useUserReportQuery();
  const muteLabel = useString('amity_chat_group_member_action_mute');
  const unmuteLabel = useString('amity_chat_group_member_action_unmute');
  const reportLabel = useString('amity_chat_member_action_report');
  const unreportLabel = useString('amity_chat_member_action_unreport');
  const promoteLabel = useString('amity_chat_member_action_promote');
  const demoteLabel = useString('amity_chat_member_action_demote');
  const banLabel = useString('amity_chat_user_action_ban');
  const removeLabel = useString('amity_chat_member_action_remove');
  const cancelLabel = useString('amity_chat_cancel');

  const promoteAlertTitle = useString('amity_chat_group_member_list_promote_title');
  const promoteAlertMessage = useString('amity_chat_group_member_list_promote_message');
  const promoteAlertConfirm = useString('amity_chat_group_member_list_promote_confirm');
  const demoteAlertTitle = useString('amity_chat_group_member_list_demote_title');
  const demoteAlertMessage = useString('amity_chat_group_member_list_demote_message');
  const demoteAlertConfirm = useString('amity_chat_group_member_list_demote_confirm');
  const removeAlertTitle = useString('amity_chat_group_member_list_remove_title');
  const removeAlertMessage = useString('amity_chat_group_member_list_remove_message');
  const removeAlertConfirm = useString('amity_chat_group_member_list_remove_confirm');
  const banAlertTitle = useString('amity_chat_ban_confirm_title');
  const banAlertMessage = useString('amity_chat_ban_confirm_message');
  const banAlertConfirm = useString('amity_chat_ban_confirm_label');

  const promoteSuccessToast = useString('amity_chat_group_member_list_toast_promoted');
  const demoteSuccessToast = useString('amity_chat_group_member_list_toast_demoted');
  const removeSuccessToast = useString('amity_chat_action_remove_member');
  const banSuccessToast = useString('amity_chat_group_member_list_toast_banned');

  const isViewerModerator = hasModeratorRole(membership?.roles);

  function handleBack() {
    pop();
  }

  function handleOpenAddMember() {
    push({
      type: ChatPageTypes.AddGroupMemberPage,
      context: { channelId },
    });
  }

  function handlePromoteConfirm(user: Amity.User) {
    confirm({
      title: promoteAlertTitle,
      content: promoteAlertMessage,
      okText: promoteAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'primary',
      onOk: async () => {
        await promoteModerator({ channelId, userIds: [user.userId] });
        success({ content: promoteSuccessToast });
      },
    });
  }

  function handleDemoteConfirm(user: Amity.User) {
    confirm({
      title: demoteAlertTitle,
      content: demoteAlertMessage,
      okText: demoteAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await demoteModerator({ channelId, userIds: [user.userId] });
        success({ content: demoteSuccessToast });
      },
    });
  }

  function handleRemoveConfirm(user: Amity.User) {
    confirm({
      title: removeAlertTitle,
      content: removeAlertMessage,
      okText: removeAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await removeMembers({ channelId, userIds: [user.userId] });
        success({ content: removeSuccessToast });
      },
    });
  }

  function handleBanConfirm(user: Amity.User) {
    confirm({
      title: banAlertTitle,
      content: banAlertMessage,
      okText: banAlertConfirm,
      cancelText: cancelLabel,
      okButtonColor: 'alert',
      onOk: async () => {
        await banUser({ channelId, userIds: [user.userId] });
        success({ content: banSuccessToast });
      },
    });
  }

  async function openMemberActions({
    user,
    isTargetModerator,
    isTargetMuted,
  }: OpenMemberActionsParams) {
    const isTargetFlagged = await UserRepository.isUserFlaggedByMe(user.userId).catch(() => false);

    const items: MemberActionItem[] = [
      {
        key: 'promote',
        icon: UserShield,
        label: promoteLabel,
        onPress: () => {
          removeDrawerData();
          handlePromoteConfirm(user);
        },
        visible: isViewerModerator && !isTargetModerator,
      },
      {
        key: 'demote',
        icon: UserShield,
        label: demoteLabel,
        onPress: () => {
          removeDrawerData();
          handleDemoteConfirm(user);
        },
        visible: isViewerModerator && isTargetModerator,
      },
      {
        key: 'mute',
        icon: Muted,
        label: muteLabel,
        onPress: () => {
          removeDrawerData();
          mute({ channelId, userId: user.userId });
        },
        visible: isViewerModerator && !isTargetMuted && !isTargetModerator,
      },
      {
        key: 'unmute',
        icon: UnMuted,
        label: unmuteLabel,
        onPress: () => {
          removeDrawerData();
          unmute({ channelId, userId: user.userId });
        },
        visible: isViewerModerator && isTargetMuted && !isTargetModerator,
      },
      {
        key: 'report',
        icon: Flag,
        label: reportLabel,
        onPress: () => {
          removeDrawerData();
          report(user.userId);
        },
        visible: !isTargetFlagged,
      },
      {
        key: 'unreport',
        icon: UnFlag,
        label: unreportLabel,
        onPress: () => {
          removeDrawerData();
          unreport(user.userId);
        },
        visible: isTargetFlagged,
      },
      {
        key: 'ban',
        icon: Banned,
        label: banLabel,
        onPress: () => {
          removeDrawerData();
          handleBanConfirm(user);
        },
        visible: isViewerModerator,
      },
      {
        key: 'remove',
        icon: TrashIcon,
        label: removeLabel,
        destructive: true,
        onPress: () => {
          removeDrawerData();
          handleRemoveConfirm(user);
        },
        visible: isViewerModerator,
      },
    ];

    setDrawerData({
      ariaLabel: 'Member actions',
      content: (
        <Menu container="drawer">
          {items
            .filter((item) => item.visible)
            .map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                label={item.label}
                destructive={item.destructive}
                onPress={item.onPress}
              />
            ))}
        </Menu>
      ),
    });
  }

  return {
    channelId,
    currentUserId,
    isViewerModerator,
    handleBack,
    handleOpenAddMember,
    openMemberActions,
  };
}
