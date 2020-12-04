import React, { useState } from 'react';
import PropTypes from 'prop-types';

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
        <div>{ placeholder }</div>
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
  placeholder = "Select...",
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(isOpen);
  const [selected, setSelected] = useState(value ? [value] : []);

  const toggle = () => setIsOpenInternal(!isOpenInternal);
  const close = () => (handleClose ? handleClose() : setIsOpenInternal(false));

  const handleSelect = selectedItem => {
    onSelect(selectedItem);

    if (multiple) {
      const index = selected.findIndex(item => selectedItem.value === item.value);
      if (index >= 0) {
        // remove item if selected twice
        setSelected([...selected.slice(0, index), ...selected.slice(index + 1)]);
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
      renderTrigger={props => renderTrigger({ ...props, onClick: toggle, selected, placeholder })}
      // when using custom trigger we should handle "close on click outside" (if needed)
      handleClose={close}
      fullSized
      scrollable
      parentContainer={parentContainer}
      disabled={disabled}
    >
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
    </Dropdown>
  );
};
Select.propTypes = {
  value: PropTypes.string,
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
};

export default Select;
