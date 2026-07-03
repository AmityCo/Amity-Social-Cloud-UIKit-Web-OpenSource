import { useMemo } from 'react';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

type ChannelType = 'conversation' | 'community';

type UserActionName = 'mute' | 'report' | 'block';

const DEFAULT_CHANNEL_TYPES: ChannelType[] = ['conversation', 'community'];

const CONFIG_USER_ACTIONS: UserActionName[] = ['mute', 'report', 'block'];

export function useChatFeatureFlags() {
  const { config } = useCustomization();
  const chatFlags = config?.feature_flags?.chat;

  const enabledChannelTypes = useMemo<ChannelType[]>(() => {
    const raw = chatFlags?.enabled_channel_types;
    if (!raw || raw.length === 0) return DEFAULT_CHANNEL_TYPES;
    return raw.length > 0 ? raw : DEFAULT_CHANNEL_TYPES;
  }, [chatFlags]);

  const userActionsMap = useMemo<Map<UserActionName, boolean> | null>(() => {
    const raw = chatFlags?.conversation_chat_user_actions;
    if (!raw || raw.length === 0) return null;
    return new Map(raw.map((a) => [a.name, a.enabled]));
  }, [chatFlags]);

  function isChatUserActionEnabled(name: UserActionName): boolean {
    if (!userActionsMap) return true;
    return userActionsMap.get(name) ?? false;
  }

  function hasAnyEnabledChatUserAction(): boolean {
    return CONFIG_USER_ACTIONS.some((name) => isChatUserActionEnabled(name));
  }

  return { enabledChannelTypes, isChatUserActionEnabled, hasAnyEnabledChatUserAction };
}
