import { Controller } from 'react-hook-form';
import { AvatarPicker } from '~/v4/chat/elements/AvatarPicker';
import { GroupNameField } from '~/v4/chat/elements/GroupNameField';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { Header } from '~/v4/chat/features/group/edit-profile/components/Header/Header';
import { useEditGroupProfile } from '~/v4/chat/features/group/edit-profile/hooks/useEditGroupProfile';
import type { EditGroupProfilePageProps } from '~/v4/chat/pages/EditGroupProfilePage';
import { useString } from '~/v4/core/localization';
import styles from './EditGroupProfile.module.css';

export function EditGroupProfile(props: EditGroupProfilePageProps) {
  const { control, handleClose, handleSave, isFormValid } = useEditGroupProfile(props);
  const namePlaceholder = useString('amity_chat_edit_group_profile_name_placeholder');

  return (
    <form className={styles.editGroupProfile} onSubmit={handleSave}>
      <Header isFormValid={isFormValid} onClose={handleClose} />
      <div className={styles.editGroupProfile__avatarWrapper}>
        <Controller
          name="avatar"
          control={control}
          render={({ field: { onChange, value } }) => (
            <AvatarPicker
              value={value}
              onChange={onChange}
              pageId={CHAT_PAGE_IDS.EDIT_GROUP_PROFILE_PAGE}
            />
          )}
        />
      </div>
      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, value } }) => (
          <GroupNameField
            required
            value={value}
            onChange={onChange}
            placeholder={namePlaceholder}
          />
        )}
      />
    </form>
  );
}
