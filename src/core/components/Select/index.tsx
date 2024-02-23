import React, { memo, useState, useEffect, ReactNode } from 'react';

import useKeyboard from '~/core/hooks/useKeyboard';
import Menu, { MenuItem } from '~/core/components/Menu';
import Dropdown from '~/core/components/Dropdown';
import { ChevronDown } from '~/icons';
import { DefaultTrigger, ItemsContainer } from './styles';

const defaultItemRenderer: SelectProps['renderItem'] = ({ value }) => <div>{value}</div>;
const defaultTriggerRenderer: SelectProps['renderTrigger'] = ({
  placeholder,
  selected,
  ...props
}) => {
  return (
    <DefaultTrigger {...props}>
      {selected && selected.length ? (
        <ItemsContainer>
          {selected.map(({ name, value }) => (
            <span key={value}>{name}</span>
          ))}
        </ItemsContainer>
      ) : (
        <div>{placeholder}</div>
      )}

      <ChevronDown height={14} width={14} />
    </DefaultTrigger>
  );
};

type Option = { name?: string; value: string };

export interface SelectProps {
  'data-qa-anchor'?: string;
  value?: Option[];
  options?: Option[];
  multiple?: boolean;
  disabled?: boolean;
  parentContainer?: Element | null;
  renderItem?: (item: Option) => ReactNode;
  renderTrigger?: (props: {
    placeholder: string;
    selected: Option[];
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
  parentContainer = null,
  renderItem = defaultItemRenderer,
  renderTrigger = defaultTriggerRenderer,
  // we pass isOpen and handleClose to manage dropdown state from parent
  isOpen,
  handleClose,
  placeholder = 'Select...',
  className = '',
  'data-qa-anchor': dataQaAnchor = '',
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
  // useKeyboard({
  //   Escape: close,
  // });

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
    toggle();
  };

  return (
    <Dropdown
      data-qa-anchor={`${dataQaAnchor}-select-dropdown`}
      isOpen={isOpen || isOpenInternal}
      renderTrigger={(props) =>
        renderTrigger({ ...props, onClick: handleClick, selected, remove, placeholder })
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
              data-qa-anchor={`${dataQaAnchor}-select-menu-item`}
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
