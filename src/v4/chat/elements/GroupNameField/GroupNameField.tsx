import { FormInput } from '~/v4/core/components/FormInput/FormInput';
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

  return (
    <FormInput
      multiLine
      value={value}
      label={label}
      optional={optional}
      required={required}
      variant="underlined"
      placeholder={placeholder ?? defaultPlaceholder}
      maxLength={GROUP_NAME_MAX_LENGTH}
      className={styles.groupNameField}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
