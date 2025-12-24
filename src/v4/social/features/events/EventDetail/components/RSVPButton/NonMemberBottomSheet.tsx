import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography';
import styles from './RSVPButton.module.css';
import { Divider } from '~/v4/social/elements/Divider/Divider';
import { useImage } from '~/v4/core/hooks/useImage';
import { People } from '~/v4/icons/People';
import { CloseButton, UserAvatar } from '~/v4/social/elements';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

type NonMemberBottomSheetProps = {
  event: Amity.Event;
  onPressJoin: () => void;
  onClose: () => void;
};

export const NonMemberBottomSheet = ({
  event,
  onPressJoin,
  onClose,
}: NonMemberBottomSheetProps) => {
  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const avatarFileUrl = useImage({
    fileId: event.targetCommunity?.avatarFileId,
    imageSize: 'medium',
  });

  return (
    <div className={styles.rsvpButton__bottomSheetMenu}>
      {isDesktop && (
        <CloseButton
          onPress={onClose}
          className={styles.rsvpButton__closePopupButton}
          defaultClassName={styles.rsvpButton__closePopupIcon}
        />
      )}
      <div className={styles.rsvpButton__container__coverImage}>
        <div className={styles.rsvpButton__coverImageWrapper}>
          {avatarFileUrl ? (
            <img
              src={avatarFileUrl}
              alt="Community Profile Cover"
              className={styles.rsvpButton__coverImage}
            />
          ) : (
            <People className={styles.rsvpButton__coverImageIconPlaceholder} />
          )}
        </div>
        <UserAvatar
          userId={currentUserId}
          imageContainerClassName={styles.rsvpButton__userAvatar__container}
          className={styles.rsvpButton__userAvatar}
          textPlaceholderClassName={styles.rsvpButton__userAvatar__textPlaceholder}
        />
      </div>
      <div className={styles.rsvpButton__bottomSheetMenuText}>
        <Typography.Headline>Join community to continue</Typography.Headline>
        <Typography.Body className={styles.rsvpButton__bottomSheetMenuBody}>
          {`Become a member of ${event.targetCommunity?.displayName} to participate in events and
        discussions.`}
        </Typography.Body>
      </div>
      <Divider className={styles.rsvpButton__divider} />
      <Button
        variant="fill"
        className={styles.rsvpButton__addToCalendarButton}
        onPress={onPressJoin}
      >
        {event.targetCommunity?.requiresJoinApproval ? 'Join community' : 'Join community and RSVP'}
      </Button>
      <Button variant="outlined" className={styles.rsvpButton__cancelButton} onPress={onClose}>
        Cancel
      </Button>
    </div>
  );
};
