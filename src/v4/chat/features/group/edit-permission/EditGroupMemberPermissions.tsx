import { Controller } from 'react-hook-form';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { RadioGroup } from '~/v4/core/components/AriaRadioGroup/RadioGroup';
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
          <Button
            type="submit"
            variant="text"
            color="primary"
            isDisabled={!isFormValid}
            data-disabled={!isFormValid ? 'true' : 'false'}
            className={styles.editGroupMemberPermissions__saveButton}
            aria-label={saveLabel}
          >
            <Typography.Body className={styles.editGroupMemberPermissions__saveLabel}>
              {saveLabel}
            </Typography.Body>
          </Button>
        }
      />
      <Typography.BodyBold className={styles.editGroupMemberPermissions__sectionTitle}>
        {messagingSection}
      </Typography.BodyBold>
      <Controller
        control={control}
        name="permission"
        render={({ field: { value, onChange } }) => (
          <RadioGroup
            value={value}
            onChange={onChange}
            aria-label={pageTitle}
            radioContainerClassname={styles.editGroupMemberPermissions__radios}
            radioProps={{ className: styles.editGroupMemberPermissions__radio }}
            radios={MESSAGING_PERMISSIONS.map((mode) => ({
              value: mode.value,
              label: (
                <MemberPermission titleKey={mode.titleKey} descriptionKey={mode.descriptionKey} />
              ),
            }))}
          />
        )}
      />
    </form>
  );
}
