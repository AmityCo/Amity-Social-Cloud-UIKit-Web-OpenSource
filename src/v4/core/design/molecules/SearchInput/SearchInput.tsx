import { Button as AriaButton } from 'react-aria-components';
import { Input } from '~/v4/core/design/atoms/Input';
import { Search } from '~/v4/core/design/icons/Search';
import { Clear } from '~/v4/core/design/icons/Clear';
import styles from './SearchInput.module.css';

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Custom clear handler; defaults to clearing the value via onChange(''). */
  onClear?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  clearAriaLabel?: string;
  'aria-label'?: string;
};

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder,
  maxLength,
  className,
  clearAriaLabel = 'Clear search',
  ...props
}: SearchInputProps) {
  return (
    <Input.Boxed
      size="small"
      variant="square"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={props['aria-label'] ?? placeholder}
      maxLength={maxLength}
      className={className}
      leadingIcon={<Search />}
      trailingIcon={
        value ? (
          <AriaButton
            type="button"
            className={styles.searchInput__clearButton}
            onPress={onClear ?? (() => onChange(''))}
            aria-label={clearAriaLabel}
          >
            <Clear />
          </AriaButton>
        ) : undefined
      }
    />
  );
}
