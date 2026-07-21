import clsx from 'clsx';
import { forwardRef, type ReactNode, type Key } from 'react';
import {
  TextField as AriaTextField,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Tag as AriaTag,
  Button as AriaButton,
} from 'react-aria-components';
import { Cross } from '~/v4/core/design/icons/Cross';
import styles from './Chip.module.css';

export type ChipData = {
  id: string;
  label: string;
  disabled?: boolean;
};

export type ChipProps = {
  chips?: ChipData[];
  onChipsChange?: (chips: ChipData[]) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  title?: string;
  hintText?: string;
  leadingIcon?: ReactNode;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onSubmit?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
};

export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    chips = [],
    onChipsChange,
    value,
    onChange,
    placeholder,
    title,
    hintText,
    leadingIcon,
    isDisabled = false,
    isInvalid = false,
    onSubmit,
    className,
    ...props
  },
  ref,
) {
  const removeChips = (keys: Set<Key>) => {
    onChipsChange?.(chips.filter((chip) => !keys.has(chip.id)));
  };

  return (
    <AriaTextField
      ref={ref}
      value={value}
      onChange={onChange}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      aria-label={title ? undefined : props['aria-label']}
      className={clsx(styles.chip, className)}
    >
      {title ? <AriaLabel className={styles.chip__title}>{title}</AriaLabel> : null}
      <div className={styles.chip__row}>
        {leadingIcon ? <span className={styles.chip__icon}>{leadingIcon}</span> : null}
        <AriaTagGroup className={styles.chip__tags} onRemove={removeChips}>
          <AriaTagList items={chips} className={styles.chip__tagList}>
            {(chip) => (
              <AriaTag id={chip.id} textValue={chip.label} className={styles.chip__tag}>
                <span className={styles.chip__tagLabel}>{chip.label}</span>
                <AriaButton slot="remove" className={styles.chip__remove} aria-label="Remove">
                  <Cross.Regular className={styles.chip__removeIcon} />
                </AriaButton>
              </AriaTag>
            )}
          </AriaTagList>
        </AriaTagGroup>
        <AriaInput
          className={styles.chip__input}
          placeholder={placeholder}
          onKeyDown={(e) => {
            const next = value?.trim();
            if (e.key === 'Enter' && next) {
              onChipsChange?.([...chips, { id: next, label: next }]);
              onChange?.('');
              onSubmit?.(next);
            }
          }}
        />
      </div>
      <span className={styles.chip__underline} />
      {hintText ? (
        <AriaText slot="description" className={styles.chip__hint}>
          {hintText}
        </AriaText>
      ) : null}
    </AriaTextField>
  );
});
