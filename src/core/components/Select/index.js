import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useKeyboard from '~/core/hooks/useKeyboard';
import Menu, { MenuItem } from '~/core/components/Menu';
import Dropdown from '~/core/components/Dropdown';
import { ChevronDown } from '~/icons';
import { DefaultTrigger, ItemsContainer } from './styles';

const itemRenderer = ({ value }) => <div>{value}</div>;
const triggerRenderer = ({ placeholder, selected, ...props }) => {
  return (
    <DefaultTrigger {...props}>
      {selected.length ? (
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

const Select = ({
  value = [],
  onSelect = () => {},
  options = [],
  multiple,
  disabled,
  parentContainer = null,
  renderItem = itemRenderer,
  renderTrigger = triggerRenderer,
  // we pass isOpen and handleClose to manage dropdown state from parent
  isOpen,
  handleClose,
  placeholder = 'Select...',
  className = '',
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [selected, setSelected] = useState(value);

  const toggle = () => setIsOpenInternal(!isOpenInternal);
  const close = () => (handleClose ? handleClose() : setIsOpenInternal(false));
  const remove = (currentItem, callback) => {
    setSelected((prev) => {
      const newSelected = prev.filter((item) => item.value !== currentItem);
      callback && callback(newSelected.map((item) => item.value));
      return newSelected;
    });
  };

  useKeyboard({
    Escape: close,
  });

  // sync internal state
  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

  const handleSelect = (selectedItem) => {
    onSelect(selectedItem);

    if (multiple) {
      const index = selected.findIndex((item) => item.value === selectedItem.value);
      if (index >= 0) {
        // remove item if selected twice
        remove(index);
      } else {
        setSelected([...selected, selectedItem]);
      }
    } else {
      setSelected([selectedItem]);
      close();
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    toggle();
  };

  return (
    <Dropdown
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
          {options.map((option) => {
            return (
              <MenuItem
                key={option.value}
                active={selected.find((item) => item.value === option.value)}
                onClick={() => handleSelect(option)}
              >
                {renderItem(option)}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </Dropdown>
  );
};
Select.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.any })),
  options: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.any })),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  parentContainer: PropTypes.instanceOf(Element),
  renderItem: PropTypes.func,
  renderTrigger: PropTypes.func,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onSelect: PropTypes.func,
};

export default memo(Select);
