import { Button } from '~/v4/core/design/atoms/Button';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';

type HeaderProps = {
  isFormValid: boolean;
  onClose: () => void;
};

export function Header({ isFormValid, onClose }: HeaderProps) {
  const title = useString('amity_chat_edit_group_profile_navbar_title');
  const saveLabel = useString('amity_chat_group_edit_profile_save');
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
          label={saveLabel}
          isDisabled={!isFormValid}
          aria-label={saveLabel}
        />
      }
    />
  );
}
