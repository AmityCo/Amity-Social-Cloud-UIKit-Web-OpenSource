import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import { Menu } from '~/v4/core/components/Menu';
import { useString } from '~/v4/core/localization';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { IconButton } from '~/v4/chat/elements/IconButton/IconButton';
import { useChatFeatureFlags } from '~/v4/chat/hooks/useChatFeatureFlags';

export function CreateChatMenu() {
  const { push } = useChatNavigation();
  const { enabledChannelTypes } = useChatFeatureFlags();

  const createAriaLabel = useString('amity_chat_create_new_chat');
  const directLabel = useString('amity_chat_create_direct');
  const groupLabel = useString('amity_chat_create_group');

  const hasConversation = enabledChannelTypes.includes('conversation');
  const hasCommunity = enabledChannelTypes.includes('community');
  const showBoth = hasConversation && hasCommunity;

  if (!showBoth) {
    return (
      <IconButton
        icon="plus"
        aria-label={createAriaLabel}
        onPress={() => {
          if (hasConversation) push({ type: ChatPageTypes.CreateConversationPage });
          else push({ type: ChatPageTypes.SelectGroupMemberPage });
        }}
      />
    );
  }

  return (
    <div>
      <Popover
        forceShowPopUp
        placement="bottom right"
        trigger={({ openPopover, isOpen }) => (
          <IconButton
            icon="plus"
            aria-label={createAriaLabel}
            aria-expanded={isOpen}
            onPress={openPopover}
          />
        )}
      >
        {({ closePopover }) => (
          <Menu>
            <Menu.Item
              icon="conversation-chat"
              label={directLabel}
              onPress={() => {
                closePopover();
                push({ type: ChatPageTypes.CreateConversationPage });
              }}
            />
            <Menu.Item
              icon="group-chat"
              label={groupLabel}
              onPress={() => {
                closePopover();
                push({ type: ChatPageTypes.SelectGroupMemberPage });
              }}
            />
          </Menu>
        )}
      </Popover>
    </div>
  );
}
