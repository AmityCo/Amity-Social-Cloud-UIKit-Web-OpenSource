import React, { memo, useState, useEffect, ReactNode } from 'react';
import clsx from 'clsx';

import useKeyboard from '~/core/hooks/useKeyboard';
import Menu, { MenuItem } from '~/core/components/Menu';
import Dropdown from '~/core/components/Dropdown';
import { DoubleChevron } from '~/icons';
import styles from './styles.module.css';

const defaultItemRenderer: SelectProps['renderItem'] = ({ value }) => <div>{value}</div>;

const defaultTriggerRenderer: SelectProps['renderTrigger'] = ({
  placeholder,
  selected,
  ...props
}) => {
  return (
    <button role="button" className={styles.defaultTrigger} {...props}>
      {selected && selected.length ? (
        <div className={styles.itemsContainer}>
          {selected.map(({ name, value }) => (
            <span key={value}>{name}</span>
          ))}
        </div>
      ) : (
        <div>{placeholder}</div>
      )}

      <DoubleChevron height={14} width={14} />
    </button>
  );
};

const floatingLabelTriggerRenderer: SelectProps['renderTrigger'] = ({
  placeholder,
  selected,
  isOpen,
  hasValue,
  error,
  disabled,
  ...props
}) => {
  const isLabelActive = isOpen || hasValue;

  return (
    <div className={styles.selectLabelContainer}>
      <button
        role="button"
        {...props}
        className={clsx(
          styles.selectTrigger,
          isOpen && styles.isOpen,
          hasValue && styles.hasValue,
          error && styles.error,
          disabled && styles.disabled,
        )}
      >
        {selected && selected.length ? (
          <div className={styles.itemsContainer}>
            {selected.map(({ name, value }) => (
              <span key={value}>{name}</span>
            ))}
          </div>
        ) : (
          <div className={clsx(styles.selectPlaceholderText, hasValue && styles.hasValue)}>
            {/* This space is only for selected values, label acts as placeholder */}
          </div>
        )}
        <DoubleChevron height={14} width={14} />
      </button>

      <label
        className={clsx(
          styles.selectLabel,
          isLabelActive && styles.isActive,
          error && styles.error,
          disabled && styles.disabled,
          isOpen && styles.isOpen,
        )}
      >
        {placeholder}
      </label>
    </div>
  );
};

type Option = { name?: string; value: string };

export interface SelectProps {
  'data-testid'?: string;
  value?: Option[];
  options?: Option[];
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  floatingLabel?: boolean;
  parentContainer?: Element | null;
  renderItem?: (item: Option) => ReactNode;
  renderTrigger?: (props: {
    placeholder: string;
    selected: Option[];
    isOpen?: boolean;
    hasValue?: boolean;
    error?: boolean;
    disabled?: boolean;
    remove: (toRemoveItem: Option, callback?: (value: string[]) => void) => void;
    onClick: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => void;
  }) => ReactNode;
  isOpen?: boolean;
  handleClose?: () => void;
  placeholder?: string;
  className?: string;
  onSelect?: (selectedItem: Option) => void;
}

const Select = ({
  value = [],
  onSelect = () => {},
  options = [],
  multiple,
  disabled,
  error = false,
  floatingLabel = false,
  parentContainer = null,
  renderItem = defaultItemRenderer,
  renderTrigger,
  // we pass isOpen and handleClose to manage dropdown state from parent
  isOpen,
  handleClose,
  placeholder = 'Select...',
  className = '',
  'data-testid': dataQaAnchor = '',
}: SelectProps) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [selected, setSelected] = useState(value);

  const toggle = () => setIsOpenInternal(!isOpenInternal);
  const close = () => (handleClose ? handleClose() : setIsOpenInternal(false));
  const remove = (toRemoveItem: Option, callback?: (newValues: string[]) => void) => {
    setSelected((prev) => {
      const newSelected = prev.filter((item) => item.value !== toRemoveItem.value);
      callback && callback(newSelected.map((item) => item.value));
      return newSelected;
    });
  };

  useKeyboard('Escape', close);

  // sync internal state
  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

  const handleSelect = (selectedItem: Option) => {
    onSelect(selectedItem);

    if (multiple) {
      const index = selected.findIndex((item) => item.value === selectedItem.value);
      if (index >= 0) {
        // remove item if selected twice
        remove(selected[index]);
      } else {
        setSelected([...selected, selectedItem]);
      }
    } else {
      setSelected([selectedItem]);
      close();
    }
  };

  const handleClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    if (!disabled) {
      toggle();
    }
  };

  const currentIsOpen = isOpen !== undefined ? isOpen : isOpenInternal;
  const hasValue = selected && selected.length > 0;

  // Choose the appropriate trigger renderer
  const triggerRenderer =
    renderTrigger || (floatingLabel ? floatingLabelTriggerRenderer : defaultTriggerRenderer);

  return (
    <Dropdown
      data-testid={`${dataQaAnchor}-select-dropdown`}
      isOpen={currentIsOpen}
      renderTrigger={(props) =>
        triggerRenderer({
          ...props,
          onClick: handleClick,
          selected,
          remove,
          placeholder,
          isOpen: currentIsOpen,
          hasValue,
          error,
          disabled,
        })
      }
      // when using custom trigger we should handle "close on click outside" (if needed)
      handleClose={close}
      fullSized
      scrollable
      parentContainer={parentContainer}
      disabled={disabled}
      className={className}
    >
      {options && options.length > 0 && (
        <Menu>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              data-testid={`${dataQaAnchor}-select-menu-item`}
              active={selected.find((item) => item.value === option.value) != null}
              onClick={() => handleSelect(option)}
            >
              {renderItem(option)}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Dropdown>
  );
};

export default memo(Select);
