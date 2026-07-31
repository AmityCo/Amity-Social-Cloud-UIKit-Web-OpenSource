import { useUser } from '~/v4/core/hooks/objects/useUser';
import { resolveString } from '~/v4/core/localization';
import { Bell } from '~/v4/core/design/icons/Bell';
import { BellSlash } from '~/v4/core/design/icons/BellSlash';
import { Ban } from '~/v4/core/design/icons/Ban';
import { Flag } from '~/v4/core/design/icons/Flag';
import { FlagSlash } from '~/v4/core/design/icons/FlagSlash';
import {
  useChannelPushNotificationQuery,
  useUserBlockQuery,
  useUserReportQuery,
} from '~/v4/chat/hooks/queries';
import { useFollowInfo } from '~/v4/chat/hooks/objects';
import { useChatFeatureFlags } from '~/v4/chat/hooks/useChatFeatureFlags';

export type UseConversationActionsParams = {
  channelId: string;
  otherUserId: string | undefined;
};

export function useConversationActions({ channelId, otherUserId }: UseConversationActionsParams) {
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
    await updateChannelPushNotification({ channelId, isEnabled: !isNotificationEnabled });
  }

  async function handleToggleReport() {
    if (!otherUserId) return;
    if (isReported) {
      await unreport(otherUserId);
    } else {
      await report(otherUserId);
    }
  }

  function handleToggleBlock() {
    if (!otherUserId) return;
    if (isBlockedByMe) {
      unblock(otherUserId, otherDisplayName);
    } else {
      block(otherUserId, otherDisplayName);
    }
  }

  const items =
    !otherUserId || !hasAnyEnabledChatUserAction()
      ? []
      : [
          {
            key: 'notification',
            icon: isNotificationEnabled ? BellSlash : Bell,
            label: resolveString(
              isNotificationEnabled
                ? 'amity_chat_action_turn_off_notification'
                : 'amity_chat_action_turn_on_notification',
            ),
            onPress: handleToggleNotification,
            visible: false,
          },
          {
            key: 'report',
            icon: isReported ? FlagSlash : Flag,
            label: resolveString(
              isReported ? 'amity_chat_action_unreport_user' : 'amity_chat_action_report_user',
            ),
            onPress: handleToggleReport,
            visible: isChatUserActionEnabled('report'),
          },
          {
            key: 'block',
            icon: Ban,
            label: resolveString(
              isBlockedByMe ? 'amity_chat_action_unblock_user' : 'amity_chat_action_block_user',
            ),
            onPress: handleToggleBlock,
            visible: isChatUserActionEnabled('block'),
          },
        ].filter((item) => item.visible);

  return {
    items,
    isBlockedByMe,
  };
}
