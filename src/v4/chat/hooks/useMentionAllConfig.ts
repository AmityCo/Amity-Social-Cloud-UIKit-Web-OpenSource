import useChatSettings from './useChatSettings';

export function useMentionAllConfig(): boolean {
  const { chatSettings } = useChatSettings();

  return chatSettings?.mention?.isAllowMentionedChannelEnabled ?? true;
}
