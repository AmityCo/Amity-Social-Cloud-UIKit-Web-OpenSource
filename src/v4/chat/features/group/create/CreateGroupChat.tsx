import { Controller } from 'react-hook-form';
import { AvatarPicker } from '~/v4/chat/elements/AvatarPicker';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { GroupNameField } from '~/v4/chat/elements/GroupNameField';
import { Header } from '~/v4/chat/features/group/create/components/Header/Header';
import { MemberGrid } from '~/v4/chat/features/group/create/components/MemberGrid/MemberGrid';
import { PrivacySection } from '~/v4/chat/features/group/create/components/PrivacySection/PrivacySection';
import { useCreateGroupChat } from '~/v4/chat/features/group/create/hooks/useCreateGroupChat';
import type { CreateGroupChatPageProps } from '~/v4/chat/pages/CreateGroupChatPage';
import styles from './CreateGroupChat.module.css';

export function CreateGroupChat({ selectedUsers }: CreateGroupChatPageProps) {
  const { form, currentUser, handleClose, handleAddMember, handleCreate, isFormValid } =
    useCreateGroupChat({ selectedUsers });

  return (
    <form className={styles.createGroupChat} onSubmit={handleCreate}>
      <Header isFormValid={isFormValid} onClose={handleClose} />
      <div className={styles.createGroupChat__avatarWrapper}>
        <Controller
          control={form.control}
          name="avatarFile"
          render={({ field: { onChange, value } }) => (
            <AvatarPicker
              value={value}
              onChange={onChange}
              pageId={CHAT_PAGE_IDS.CREATE_GROUP_CHAT_PAGE}
            />
          )}
        />
      </div>
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <GroupNameField value={value} onChange={onChange} optional />
        )}
      />
      <Controller
        control={form.control}
        name="isPublic"
        render={({ field: { onChange, value } }) => (
          <PrivacySection isPublic={value} onChange={onChange} />
        )}
      />
      <Controller
        control={form.control}
        name="members"
        render={({ field }) => (
          <MemberGrid
            currentUser={currentUser}
            members={field.value}
            onAddMember={handleAddMember}
            onRemoveMember={(userId) =>
              field.onChange(field.value.filter((user) => user.userId !== userId))
            }
          />
        )}
      />
    </form>
  );
}
