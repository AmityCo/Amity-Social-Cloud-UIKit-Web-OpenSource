import { Calendar } from '~/v4/icons/Calendar';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography';
import styles from './RSVPButton.module.css';
import { AddCalendar } from '~/v4/icons/AddCalendar';
import { Divider } from '~/v4/social/elements/Divider/Divider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { CloseButton } from '~/v4/social/elements';

type MemberBottomSheetProps = {
  onPressAddToCalendar: () => void;
  onClose: () => void;
};

export const MemberBottomSheet = ({ onPressAddToCalendar, onClose }: MemberBottomSheetProps) => {
  const { isDesktop } = useResponsive();

  return (
    <div className={styles.rsvpButton__bottomSheetMenu}>
      {isDesktop && (
        <CloseButton
          onPress={onClose}
          className={styles.rsvpButton__closePopupButton}
          defaultClassName={styles.rsvpButton__closePopupIcon}
        />
      )}
      <Calendar className={styles.rsvpButton__calendarIcon} />
      <div className={styles.rsvpButton__bottomSheetMenuText}>
        <Typography.Headline>You’ll be notified.</Typography.Headline>
        <Typography.Body className={styles.rsvpButton__bottomSheetMenuBody}>
          {useString('amity_social_modal_add_calendar_sheet_description')}
        </Typography.Body>
      </div>
      <Divider className={styles.rsvpButton__divider} />
      <Button
        variant="fill"
        className={styles.rsvpButton__addToCalendarButton}
        onPress={onPressAddToCalendar}
      >
        <AddCalendar className={styles.rsvpButton__addToCalendarIcon} />
        {useString('amity_social_modal_add_calendar_sheet_add_button')}
      </Button>
    </div>
  );
};
