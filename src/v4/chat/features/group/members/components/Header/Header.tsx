import { TopBar } from '~/v4/chat/elements/TopBar';
import { IconButton } from '~/v4/chat/elements/IconButton';
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
          <IconButton
            icon="plus"
            variant="transparent"
            onPress={onAddMember}
            aria-label="Add member"
          />
        ) : undefined
      }
    />
  );
}
