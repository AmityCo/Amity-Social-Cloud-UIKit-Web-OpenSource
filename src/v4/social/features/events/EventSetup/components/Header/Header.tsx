import { Typography } from '~/v4/core/components';
import { PAGE_ID } from '~/v4/constants/customization';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { BackButton, CloseButton, Title } from '~/v4/social/elements';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './Header.module.css';

type HeaderProps = {
  targetName?: string;
  showDiscardPopup?: boolean;
  isCreateEvent?: boolean;
};

export function Header({ showDiscardPopup, targetName, isCreateEvent }: HeaderProps) {
  const { onBack } = useNavigation();
  const { isDesktop } = useResponsive();
  const { confirm } = useConfirmContext();

  const handleBackClick = () => {
    showDiscardPopup
      ? confirm({
          title: 'Leave without finishing?',
          content: isCreateEvent
            ? "Your progress won't be saved and your event won't be created."
            : 'Your changes that you made may not be saved.',
          okText: 'Leave',
          cancelText: 'Cancel',
          onOk: onBack,
        })
      : onBack();
  };

  return (
    <div className={styles.header}>
      {isDesktop ? (
        <BackButton pageId={PAGE_ID.EVENT_SETUP_PAGE} onPress={handleBackClick} />
      ) : (
        <CloseButton pageId={PAGE_ID.EVENT_SETUP_PAGE} onPress={handleBackClick} />
      )}
      <div className={styles.header__title}>
        <Title variant="headline">{isCreateEvent ? 'Create event' : 'Edit event'}</Title>
        {isCreateEvent && (
          <Typography.Caption className={styles.header__description}>
            {targetName}
          </Typography.Caption>
        )}
      </div>
      <div className={styles.header__empty} />
    </div>
  );
}
