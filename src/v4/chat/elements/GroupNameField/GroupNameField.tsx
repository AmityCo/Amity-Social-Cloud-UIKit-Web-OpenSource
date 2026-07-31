import { Input } from '~/v4/core/design/atoms/Input';
import { GROUP_NAME_MAX_LENGTH } from '~/v4/chat/constants';
import { useString } from '~/v4/core/localization';
import styles from './GroupNameField.module.css';

type GroupNameFieldProps = {
  value: string;
  optional?: boolean;
  required?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function GroupNameField({
  value,
  onChange,
  optional = false,
  required = false,
  placeholder,
}: GroupNameFieldProps) {
  const label = useString('amity_chat_group_name_label');
  const defaultPlaceholder = useString('amity_chat_group_name_placeholder');
  const optionalLabel = useString('amity_chat_group_name_optional');
  const requiredLabel = useString('amity_chat_group_name_required');

  const marker = required ? requiredLabel : optional ? optionalLabel : undefined;

  return (
    <Input.Text
      title={label}
      optionalLabel={marker}
      value={value}
      onChange={onChange}
      placeholder={placeholder ?? defaultPlaceholder}
      showCharacterCount
      maxLength={GROUP_NAME_MAX_LENGTH}
      multiLine
      className={styles.groupNameField}
    />
  );
}
