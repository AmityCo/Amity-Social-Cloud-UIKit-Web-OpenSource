import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import { Menu } from '~/v4/core/components/Menu';
import { useString } from '~/v4/core/localization';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { IconButton } from '~/v4/chat/elements/IconButton/IconButton';
import { ArchiveBox } from '~/v4/icons/ArchiveBox';

export function ChatHomeMenu() {
  const { push } = useChatNavigation();
  const archivedLabel = useString('amity_chat_archived');

  return (
    <div>
      <Popover
        forceShowPopUp
        placement="bottom right"
        trigger={({ openPopover, isOpen }) => (
          <IconButton
            icon="ellipsis-v"
            aria-label="Chat menu"
            aria-expanded={isOpen}
            onPress={openPopover}
          />
        )}
      >
        {({ closePopover }) => (
          <Menu>
            <Menu.Item
              icon={ArchiveBox}
              label={archivedLabel}
              onPress={() => {
                closePopover();
                push({ type: ChatPageTypes.ArchivedChatPage });
              }}
            />
          </Menu>
        )}
      </Popover>
    </div>
  );
}
