import { AmityChannelNotificationModeEnum } from '@amityco/ts-sdk';
import { Controller } from 'react-hook-form';
import { Button } from '~/v4/core/design/atoms/Button';
import { Selection } from '~/v4/core/design/atoms/Selection';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';
import { NotificationMode } from '~/v4/chat/features/group/edit-notification/components/NotificationMode/NotificationMode';
import { useEditGroupNotification } from '~/v4/chat/features/group/edit-notification/hooks/useEditGroupNotification';
import type { EditGroupNotificationPageProps } from '~/v4/chat/pages/EditGroupNotificationPage';
import styles from './EditGroupNotification.module.css';

export function EditGroupNotification(props: EditGroupNotificationPageProps) {
  const { control, handleClose, handleSave, isFormValid } = useEditGroupNotification(props);
  const pageTitle = useString('amity_chat_group_notifications');
  const saveLabel = useString('amity_chat_group_edit_notification_save');
  const defaultModeTitle = useString('amity_chat_group_notification_default_title');
  const defaultModeDesc = useString('amity_chat_group_notification_default_desc');
  const silentModeTitle = useString('amity_chat_group_notification_silent_title');
  const silentModeDesc = useString('amity_chat_group_notification_silent_desc');
  const subscribeModeTitle = useString('amity_chat_group_notification_subscribe_title');
  const subscribeModeDesc = useString('amity_chat_group_notification_subscribe_desc');

  const notificationModes = [
    {
      value: AmityChannelNotificationModeEnum.Default,
      title: defaultModeTitle,
      description: defaultModeDesc,
    },
    {
      value: AmityChannelNotificationModeEnum.Silent,
      title: silentModeTitle,
      description: silentModeDesc,
    },
    {
      value: AmityChannelNotificationModeEnum.Subscribe,
      title: subscribeModeTitle,
      description: subscribeModeDesc,
    },
  ];

  return (
    <form className={styles.editGroupNotification} onSubmit={handleSave}>
      <TopBar
        title={pageTitle}
        leadingType="back"
        onLeading={handleClose}
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
      <Controller
        control={control}
        name="notificationMode"
        render={({ field: { value, onChange } }) => (
          <Selection.RadioGroup
            value={value}
            onChange={onChange}
            aria-label={pageTitle}
            className={styles.editGroupNotification__radios}
          >
            {notificationModes.map((mode) => (
              <Selection.Radio
                key={mode.value}
                value={mode.value}
                className={styles.editGroupNotification__radio}
              >
                <NotificationMode title={mode.title} description={mode.description} />
              </Selection.Radio>
            ))}
          </Selection.RadioGroup>
        )}
      />
    </form>
  );
}
