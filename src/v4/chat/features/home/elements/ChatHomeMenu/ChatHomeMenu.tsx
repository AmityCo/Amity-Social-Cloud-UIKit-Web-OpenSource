import { Popover } from '~/v4/core/design/components/Popover/Popover';
import { Menu } from '~/v4/core/design/components/Menu';
import { TypographyVariant } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { Button } from '~/v4/core/design/atoms/Button';
import { EllipsisV } from '~/v4/core/design/icons/EllipsisV';
import { Archive } from '~/v4/core/design/icons/Archive';

export function ChatHomeMenu() {
  const { push } = useChatNavigation();
  const archivedLabel = useString('amity_chat_archived');

  return (
    <Popover
      forceShowPopUp
      placement="bottom right"
      trigger={({ openPopover, isOpen }) => (
        <Button.Icon
          icon={<EllipsisV />}
          styleType="filled"
          hierarchy="secondary"
          size={32}
          aria-label="Chat menu"
          aria-expanded={isOpen}
          onPress={openPopover}
        />
      )}
    >
      {({ closePopover }) => (
        <Menu container="popover">
          <Menu.Item
            icon={<Archive />}
            label={archivedLabel}
            typography={TypographyVariant.Body}
            onPress={() => {
              closePopover();
              push({ type: ChatPageTypes.ArchivedChatPage });
            }}
          />
        </Menu>
      )}
    </Popover>
  );
}
