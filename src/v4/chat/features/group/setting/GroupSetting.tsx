import { Typography } from '~/v4/core/components/Typography/Typography';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { SettingMenu } from '~/v4/chat/elements/SettingMenu';
import { Header } from '~/v4/chat/features/group/setting/components/Header/Header';
import { useGroupSetting } from '~/v4/chat/features/group/setting/hooks/useGroupSetting';
import { useString } from '~/v4/core/localization';
import type { GroupSettingPageProps } from '~/v4/chat/pages/GroupSettingPage';
import styles from './GroupSetting.module.css';

export function GroupSetting(props: GroupSettingPageProps) {
  const {
    title,
    avatar,
    isPublic,
    handleClose,
    handleLeaveGroup,
    visibleGroupItems,
    visiblePreferenceItems,
  } = useGroupSetting(props);

  const groupSettingsSection = useString('amity_chat_group_settings_section');
  const yourPreferencesSection = useString('amity_chat_your_preferences_section');
  const leaveGroupLabel = useString('amity_chat_group_leave');

  return (
    <div className={styles.groupSetting}>
      <Header title={title} onBack={handleClose} />
      <div className={styles.groupSetting__avatarWrapper}>
        <div className={styles.groupSetting__avatar}>
          <Avatar.GroupChat avatar={avatar} size="lg" />
        </div>
      </div>
      {visibleGroupItems.length > 0 && (
        <div className={styles.groupSetting__section}>
          <Typography.TitleBold className={styles.groupSetting__sectionTitle}>
            {groupSettingsSection}
          </Typography.TitleBold>
          {visibleGroupItems.map(({ key, visible: _, ...itemProps }) => (
            <SettingMenu key={key} {...itemProps} />
          ))}
        </div>
      )}
      {visibleGroupItems.length > 0 && visiblePreferenceItems.length > 0 && (
        <hr className={styles.groupSetting__divider} />
      )}
      {visiblePreferenceItems.length > 0 && (
        <div className={styles.groupSetting__section}>
          <Typography.TitleBold className={styles.groupSetting__sectionTitle}>
            {yourPreferencesSection}
          </Typography.TitleBold>
          {visiblePreferenceItems.map(({ key, visible: _, ...itemProps }) => (
            <SettingMenu key={key} {...itemProps} />
          ))}
        </div>
      )}
      <div className={styles.groupSetting__section}>
        <SettingMenu
          destructive
          label={leaveGroupLabel}
          onPress={handleLeaveGroup}
          ariaLabel={leaveGroupLabel}
        />
      </div>
    </div>
  );
}
