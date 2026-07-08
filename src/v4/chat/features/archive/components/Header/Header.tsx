import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';

type HeaderProps = {
  onBack: () => void;
};

export function Header({ onBack }: HeaderProps) {
  const title = useString('amity_chat_archived_navbar_title');
  return <TopBar title={title} leadingType="back" onLeading={onBack} />;
}
