import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { toArray } from '~/helpers';
import useKeyboard from '~/core/hooks/useKeyboard';
import Menu, { MenuItem } from '~/core/components/Menu';
import Dropdown from '~/core/components/Dropdown';
import ConditionalRender from '~/core/components/ConditionalRender';
import { ChevronDown } from '~/icons';
import { DefaultTrigger, ItemsContainer } from './styles';

const itemRenderer = ({ value }) => <div>{value}</div>;
const triggerRenderer = ({ placeholder, selected, ...props }) => {
  return (
    <DefaultTrigger {...props}>
      <ConditionalRender condition={selected.length}>
        <ItemsContainer>
          {selected.map(({ name, value }) => (
            <span key={value}>{name}</span>
          ))}
        </ItemsContainer>
        <div>{placeholder}</div>
      </ConditionalRender>
      <ChevronDown />
    </DefaultTrigger>
  );
};

const Select = ({
  value,
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
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [selected, setSelected] = useState(value ? toArray(value) : []);

  const toggle = () => setIsOpenInternal(!isOpenInternal);
  const close = () => (handleClose ? handleClose() : setIsOpenInternal(false));
  const removeByIndex = index => {
    setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
  };

  useKeyboard({
    Escape: close,
  });

  // sync internal state
  useEffect(() => {
    setIsOpenInternal(isOpen);
  }, [isOpen]);

  const handleSelect = selectedItem => {
    onSelect(selectedItem);

    if (multiple) {
      const index = selected.findIndex(item => item.value === selectedItem.value);
      if (index >= 0) {
        // remove item if selected twice
        removeByIndex(index);
      } else {
        setSelected([...selected, selectedItem]);
      }
    } else {
      setSelected([selectedItem]);
      close();
    }
  };

  return (
    <Dropdown
      isOpen={isOpen || isOpenInternal}
      renderTrigger={props =>
        renderTrigger({ ...props, onClick: toggle, selected, removeByIndex, placeholder })
      }
      // when using custom trigger we should handle "close on click outside" (if needed)
      handleClose={close}
      fullSized
      scrollable
      parentContainer={parentContainer}
      disabled={disabled}
    >
      <ConditionalRender condition={options && options.length}>
        <Menu>
          {options.map(option => {
            return (
              <MenuItem
                key={option.value}
                onClick={() => handleSelect(option)}
                active={selected.find(item => item.value === option.value)}
              >
                {renderItem(option)}
              </MenuItem>
            );
          })}
        </Menu>
      </ConditionalRender>
    </Dropdown>
  );
};
Select.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      value: PropTypes.any,
    }),
  ),
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  parentContainer: PropTypes.element,
  renderItem: PropTypes.func,
  renderTrigger: PropTypes.func,
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  placeholder: PropTypes.string,
};

export default Select;
