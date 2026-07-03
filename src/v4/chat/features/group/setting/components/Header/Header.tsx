import { TopBar } from '~/v4/chat/elements/TopBar';

type HeaderProps = {
  title: string;
  onBack: () => void;
};

export function Header({ title, onBack }: HeaderProps) {
  return <TopBar title={title} leadingType="back" onLeading={onBack} />;
}
