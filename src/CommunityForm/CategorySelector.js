import React, { useState, useEffect } from 'react';
import { MenuItem } from '../commonComponents/Menu';

import { customizableComponent } from '../hoks/customization';
import { getCategories, getCategory } from '../mock';

import {
  Avatar,
  Categories,
  CategoryItem,
  Selector,
  SelectorPopover,
  SelectorList,
  SelectIcon,
} from './styles';

const Category = ({ category }) => (
  <>
    <Avatar size="tiny" avatar={category.avatar} /> {category.name}
  </>
);

const CategorySelector = ({ value: categoryId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const categories = getCategories();

  const category = getCategory(categoryId);

  const list = (
    <SelectorList>
      {categories.map(category => (
        <MenuItem
          onClick={() => {
            close();
            onChange(category.id);
          }}
        >
          <Category category={category} />
        </MenuItem>
      ))}
    </SelectorList>
  );

  return (
    <SelectorPopover isOpen={isOpen} onClickOutside={close} content={list}>
      <Selector onClick={open}>
        {categoryId && <Category category={category} />} <SelectIcon />
      </Selector>
    </SelectorPopover>
  );
};

export default customizableComponent('CategorySelector')(CategorySelector);
