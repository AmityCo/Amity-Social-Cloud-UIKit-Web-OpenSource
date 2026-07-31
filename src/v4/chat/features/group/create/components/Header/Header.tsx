import { Button } from '~/v4/core/design/atoms/Button';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';

type HeaderProps = {
  isFormValid: boolean;
  onClose: () => void;
};

export function Header({ isFormValid, onClose }: HeaderProps) {
  const title = useString('amity_chat_create_group_title');
  const createLabel = useString('amity_chat_create_group_button');
  return (
    <TopBar
      title={title}
      leadingType="back"
      onLeading={onClose}
      trailing={
        <Button.Main
          type="submit"
          styleType="ghost"
          hierarchy="primary"
          size="sm"
          label={createLabel}
          isDisabled={!isFormValid}
          aria-label={createLabel}
        />
      }
    />
  );
}
