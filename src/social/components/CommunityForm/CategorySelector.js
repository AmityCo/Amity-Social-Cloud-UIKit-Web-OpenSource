import React, { useState } from 'react';

import { isEmpty } from '~/helpers';
import { MenuItem } from '~/core/components/Menu';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as CategoryImage } from '~/icons/Category';
import useCategories from '~/social/hooks/useCategories';
import useCategory from '~/social/hooks/useCategory';
import ConditionalRender from '~/core/components/ConditionalRender';

import { Avatar, Selector, SelectorPopover, SelectorList, SelectIcon } from './styles';

const Category = ({ category }) => (
  <ConditionalRender condition={!isEmpty(category)}>
    <>
      <Avatar size="tiny" avatar={category.avatar} backgroundImage={CategoryImage} />
      {` ${category.name}`}
    </>
  </ConditionalRender>
);

const CategorySelector = ({ value: categoryId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const { categories } = useCategories();
  const { currentCategory } = useCategory(categoryId);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  const list = (
    <SelectorList>
      {/* TODO empty state */}
      {categories.map(category => (
        <MenuItem
          key={category.id}
          onClick={() => {
            setSelectedCategory(category);
            close();
            onChange(category.id);
          }}
        >
          <Category key={category.id} category={category} />
        </MenuItem>
      ))}
    </SelectorList>
  );

  return (
    <SelectorPopover isOpen={isOpen} onClickOutside={close} content={list}>
      <Selector onClick={open}>
        <Category category={selectedCategory} /> <SelectIcon />
      </Selector>
    </SelectorPopover>
  );
};

export default customizableComponent('CategorySelector', CategorySelector);
