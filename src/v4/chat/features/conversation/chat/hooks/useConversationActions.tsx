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
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';

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

  // Block and Unblock are User Relationship's, so the module withholds the row
  // whichever label it wears — ANDed with the config switch, not replacing it
  // (AmityConversationChatUserActionComponent REQ-008). The config says who may
  // block inside a feature that exists; the module says whether it exists.
  //
  // The component segment is the spec's name for this sheet, which Web draws
  // through the header's action menu rather than a component of its own. It is
  // Chat's, so the path resolves to [chat, chat, userRelationship] and either
  // module withholds the row. Report stays on config alone: it is moderation,
  // not a relationship (REQ-008a).
  const blockRow = useAmityElement({
    pageId: CHAT_PAGE_IDS.CHAT_PAGE,
    componentId: 'conversation_chat_user_action_component',
    elementId: isBlockedByMe ? ELEMENT_ID.UNBLOCK_USER_BUTTON : ELEMENT_ID.BLOCK_USER_BUTTON,
  });
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
            visible: isChatUserActionEnabled('block') && !blockRow.isExcluded,
          },
        ].filter((item) => item.visible);

  return {
    items,
    isBlockedByMe,
  };
}
