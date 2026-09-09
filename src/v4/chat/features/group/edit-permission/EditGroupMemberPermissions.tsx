import { Controller } from 'react-hook-form';
import { Button } from '~/v4/core/design/atoms/Button';
import { Selection } from '~/v4/core/design/atoms/Selection';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';
import { MESSAGING_PERMISSIONS } from '~/v4/chat/features/group/edit-permission/constants';
import { MemberPermission } from '~/v4/chat/features/group/edit-permission/components/MemberPermission/MemberPermission';
import { useEditGroupMemberPermissions } from '~/v4/chat/features/group/edit-permission/hooks/useEditGroupMemberPermissions';
import type { EditGroupMemberPermissionsPageProps } from '~/v4/chat/pages/EditGroupMemberPermissionsPage';
import styles from './EditGroupMemberPermissions.module.css';

export function EditGroupMemberPermissions(props: EditGroupMemberPermissionsPageProps) {
  const { control, handleClose, handleSave, isFormValid } = useEditGroupMemberPermissions(props);
  const pageTitle = useString('amity_chat_group_member_permissions_navbar_title');
  const saveLabel = useString('amity_chat_group_edit_permission_save');
  const messagingSection = useString('amity_chat_group_edit_permissions_messaging_title');

  return (
    <form className={styles.editGroupMemberPermissions} onSubmit={handleSave}>
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
      <Typography.TitleBold className={styles.editGroupMemberPermissions__sectionTitle}>
        {messagingSection}
      </Typography.TitleBold>
      <Controller
        control={control}
        name="permission"
        render={({ field: { value, onChange } }) => (
          <Selection.RadioGroup
            value={value}
            onChange={onChange}
            aria-label={pageTitle}
            className={styles.editGroupMemberPermissions__radios}
          >
            {MESSAGING_PERMISSIONS.map((mode) => (
              <Selection.Radio
                key={mode.value}
                value={mode.value}
                className={styles.editGroupMemberPermissions__radio}
              >
                <MemberPermission titleKey={mode.titleKey} descriptionKey={mode.descriptionKey} />
              </Selection.Radio>
            ))}
          </Selection.RadioGroup>
        )}
      />
    </form>
  );
}
