import type { ComponentType, SVGProps } from 'react';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { resolveString } from '~/v4/core/localization';
import { Menu } from '~/v4/core/components/Menu';
import BellOutlined from '~/v4/icons/BellOutlined';
import BellSlash from '~/v4/icons/BellSlash';
import BlockedUser from '~/v4/icons/BlockedUser';
import Flag from '~/v4/icons/Flag';
import UnFlag from '~/v4/icons/UnFlag';
import {
  useChannelPushNotificationQuery,
  useUserBlockQuery,
  useUserReportQuery,
} from '~/v4/chat/hooks/queries';
import { useFollowInfo } from '~/v4/chat/hooks/objects';
import { useChatFeatureFlags } from '~/v4/chat/hooks/useChatFeatureFlags';

type ConversationActionItem = {
  key: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onPress: () => void;
};

export type UseConversationActionsParams = {
  channelId: string;
  otherUserId: string | undefined;
};

export function useConversationActions({ channelId, otherUserId }: UseConversationActionsParams) {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { user } = useUser({ userId: otherUserId, shouldCall: !!otherUserId });
  const otherDisplayName = user?.displayName ?? user?.userId ?? '';

  const { isEnabled: isNotificationEnabled, updateChannelPushNotification } =
    useChannelPushNotificationQuery({ channelId, enabled: !!channelId });
  const { isBlockedByMe } = useFollowInfo({ userId: otherUserId });
  const { isChatUserActionEnabled, hasAnyEnabledChatUserAction } = useChatFeatureFlags();
  const { block, unblock } = useUserBlockQuery();
  const {
    isFlaggedByMe: isReported,
    report,
    unreport,
  } = useUserReportQuery({ userId: otherUserId });

  async function handleToggleNotification() {
    if (!channelId) return;
    removeDrawerData();
    await updateChannelPushNotification({ channelId, isEnabled: !isNotificationEnabled });
  }

  async function handleToggleReport() {
    if (!otherUserId) return;
    removeDrawerData();
    if (isReported) {
      await unreport(otherUserId);
    } else {
      await report(otherUserId);
    }
  }

  function handleToggleBlock() {
    if (!otherUserId) return;
    removeDrawerData();
    if (isBlockedByMe) {
      unblock(otherUserId, otherDisplayName);
    } else {
      block(otherUserId, otherDisplayName);
    }
  }

  function openConversationActions() {
    if (!otherUserId || !hasAnyEnabledChatUserAction()) return;

    const allItems: (ConversationActionItem & { visible: boolean })[] = [
      {
        key: 'notification',
        icon: isNotificationEnabled ? BellSlash : BellOutlined,
        label: resolveString(
          isNotificationEnabled
            ? 'amity_chat_action_turn_off_notification'
            : 'amity_chat_action_turn_on_notification',
        ),
        onPress: handleToggleNotification,
        visible: isChatUserActionEnabled('mute'),
      },
      {
        key: 'report',
        icon: isReported ? UnFlag : Flag,
        label: resolveString(
          isReported ? 'amity_chat_action_unreport_user' : 'amity_chat_action_report_user',
        ),
        onPress: handleToggleReport,
        visible: isChatUserActionEnabled('report'),
      },
      {
        key: 'block',
        icon: BlockedUser,
        label: resolveString(
          isBlockedByMe ? 'amity_chat_action_unblock_user' : 'amity_chat_action_block_user',
        ),
        onPress: handleToggleBlock,
        visible: isChatUserActionEnabled('block'),
      },
    ];

    const items = allItems.filter((item) => item.visible);

    setDrawerData({
      ariaLabel: 'Conversation actions',
      content: (
        <Menu container="drawer">
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} label={item.label} onPress={item.onPress} />
          ))}
        </Menu>
      ),
    });
  }

  return {
    openConversationActions: hasAnyEnabledChatUserAction() ? openConversationActions : undefined,
    isBlockedByMe,
  };
}
