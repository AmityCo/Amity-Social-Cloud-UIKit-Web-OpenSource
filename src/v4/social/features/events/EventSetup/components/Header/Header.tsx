import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
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

  const leaveWithoutFinishingTitle = useString(
    'amity_social_modal_dialog_title_leave_without_finishing',
  );
  const progressNotSavedContent = useString('amity_social_button_event_progress_not_saved');
  const unsavedChangesContent = useString('amity_social_button_event_unsaved_changes');
  const leaveText = useString('amity_social_button_leave');
  const cancelText = useString('amity_social_button_cancel');
  const createEventLabel = useString('amity_social_button_create_event');
  const editEventLabel = useString('amity_social_button_edit_event');

  const handleBackClick = () => {
    showDiscardPopup
      ? confirm({
          title: leaveWithoutFinishingTitle,
          content: isCreateEvent ? progressNotSavedContent : unsavedChangesContent,
          okText: leaveText,
          cancelText: cancelText,
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
        <Title variant="headline">{isCreateEvent ? createEventLabel : editEventLabel}</Title>
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
