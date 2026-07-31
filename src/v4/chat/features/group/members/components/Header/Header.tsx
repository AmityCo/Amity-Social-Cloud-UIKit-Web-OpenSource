import { TopBar } from '~/v4/chat/elements/TopBar';
import { Button } from '~/v4/core/design/atoms/Button';
import { Plus } from '~/v4/core/design/icons/Plus';
import { useString } from '~/v4/core/localization';

type HeaderProps = {
  isViewerModerator: boolean;
  onBack: () => void;
  onAddMember: () => void;
};

export function Header({ isViewerModerator, onBack, onAddMember }: HeaderProps) {
  const title = useString('amity_chat_member_list_title');
  return (
    <TopBar
      title={title}
      leadingType="back"
      onLeading={onBack}
      trailing={
        isViewerModerator ? (
          <Button.Icon
            icon={<Plus />}
            styleType="ghost"
            hierarchy="secondary"
            size={32}
            onPress={onAddMember}
            aria-label="Add member"
          />
        ) : undefined
      }
    />
  );
}
