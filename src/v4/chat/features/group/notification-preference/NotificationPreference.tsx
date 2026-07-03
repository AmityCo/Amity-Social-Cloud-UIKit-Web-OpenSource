import { Controller } from 'react-hook-form';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';
import { AllowNotifications } from '~/v4/chat/features/group/notification-preference/components/AllowNotifications/AllowNotifications';
import { DisabledByModeratorBanner } from '~/v4/chat/features/group/notification-preference/components/DisabledByModeratorBanner/DisabledByModeratorBanner';
import { useNotificationPreference } from '~/v4/chat/features/group/notification-preference/hooks/useNotificationPreference';
import type { GroupNotificationPreferencePageProps } from '~/v4/chat/pages/GroupNotificationPreferencePage';
import styles from './NotificationPreference.module.css';

export function NotificationPreference(props: GroupNotificationPreferencePageProps) {
  const { control, handleClose, handleSave, isSilent, persistedIsEnabled } =
    useNotificationPreference(props);
  const pageTitle = useString('amity_chat_group_notif_pref_navbar_title');
  const showDisabledByModeratorBanner = false;

  return (
    <div className={styles.notificationPreference}>
      <TopBar title={pageTitle} leadingType="back" onLeading={handleClose} />
      {showDisabledByModeratorBanner && isSilent && <DisabledByModeratorBanner />}
      {isSilent ? (
        <AllowNotifications isSelected={persistedIsEnabled} isDisabled />
      ) : (
        <Controller
          control={control}
          name="isEnabled"
          render={({ field: { value, onChange } }) => (
            <AllowNotifications
              isSelected={value}
              onChange={(next) => {
                onChange(next);
                handleSave();
              }}
            />
          )}
        />
      )}
    </div>
  );
}
