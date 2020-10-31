import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import useCategories from '~/social/hooks/useCategories';

import CategoryHeader from '~/social/components/CategoryHeader';

import { Selector, SelectorPopover, SelectorList, SelectIcon, InputPlaceholder } from './styles';

const CategorySelector = ({ value: categoryId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const { categories } = useCategories();

  const list = (
    <SelectorList>
      {/* TODO empty state */}
      {categories.map(category => (
        <MenuItem
          key={category.categoryId}
          active={categoryId === category.categoryId}
          onClick={() => {
            onChange(category.categoryId);
            close();
          }}
        >
          <CategoryHeader key={category.categoryId} categoryId={category.categoryId} />
        </MenuItem>
      ))}
    </SelectorList>
  );

  return (
    <SelectorPopover isOpen={isOpen} onClickOutside={close} content={list} fixed>
      <Selector onClick={open}>
        {categoryId ? (
          <CategoryHeader categoryId={categoryId} />
        ) : (
          <FormattedMessage id="selectACategory">
            {placeholder => <InputPlaceholder>{placeholder}</InputPlaceholder>}
          </FormattedMessage>
        )}
        <SelectIcon />
      </Selector>
    </SelectorPopover>
  );
};

export default customizableComponent('CategorySelector', CategorySelector);
