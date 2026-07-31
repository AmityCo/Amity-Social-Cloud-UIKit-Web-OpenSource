import { Popover } from '~/v4/core/design/components/Popover/Popover';
import { Menu } from '~/v4/core/design/components/Menu';
import { TypographyVariant } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { Button } from '~/v4/core/design/atoms/Button';
import { Plus } from '~/v4/core/design/icons/Plus';
import { UserPlus } from '~/v4/core/design/icons/UserPlus';
import { UserGroup } from '~/v4/core/design/icons/UserGroup';
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
      <Button.Icon
        icon={<Plus />}
        styleType="filled"
        hierarchy="secondary"
        size={32}
        aria-label={createAriaLabel}
        onPress={() => {
          if (hasConversation) push({ type: ChatPageTypes.CreateConversationPage });
          else push({ type: ChatPageTypes.SelectGroupMemberPage });
        }}
      />
    );
  }

  return (
    <Popover
      forceShowPopUp
      placement="bottom right"
      trigger={({ openPopover, isOpen }) => (
        <Button.Icon
          icon={<Plus />}
          styleType="filled"
          hierarchy="secondary"
          size={32}
          aria-label={createAriaLabel}
          aria-expanded={isOpen}
          onPress={openPopover}
        />
      )}
    >
      {({ closePopover }) => (
        <Menu container="popover">
          <Menu.Item
            icon={<UserPlus />}
            label={directLabel}
            typography={TypographyVariant.Body}
            onPress={() => {
              closePopover();
              push({ type: ChatPageTypes.CreateConversationPage });
            }}
          />
          <Menu.Item
            icon={<UserGroup />}
            label={groupLabel}
            typography={TypographyVariant.Body}
            onPress={() => {
              closePopover();
              push({ type: ChatPageTypes.SelectGroupMemberPage });
            }}
          />
        </Menu>
      )}
    </Popover>
  );
}
