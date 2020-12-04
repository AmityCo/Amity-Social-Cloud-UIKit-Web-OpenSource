import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import customizableComponent from '~/core/hocs/customization';
import Select from '~/core/components/Select';
import useCategories from '~/social/hooks/useCategories';
import CategoryHeader from '~/social/components/category/Header';

import { Selector, SelectIcon, InputPlaceholder } from './styles';

const CategorySelector = ({ value: categoryId, onChange, parentContainer = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const [categories] = useCategories({ isDeleted: false });
  const options = categories.map(category => ({
    name: category.name,
    value: category.categoryId,
  }));

  const itemRenderer = ({ value }) => <CategoryHeader categoryId={value} />;

  const triggerRenderer = props => {
    return (
      <Selector {...props}>
        {categoryId ? (
          <CategoryHeader categoryId={categoryId} />
        ) : (
          <FormattedMessage id="selectACategory">
            {placeholder => <InputPlaceholder>{placeholder}</InputPlaceholder>}
          </FormattedMessage>
        )}
        <SelectIcon />
      </Selector>
    );
  };

  return (
    <Select
      options={options}
      onSelect={({ value }) => onChange(value)}
      renderTrigger={props => triggerRenderer({ ...props, onClick: toggle })}
      renderItem={itemRenderer}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
    />
  );
};

CategorySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  parentContainer: PropTypes.element,
};

export default customizableComponent('CategorySelector', CategorySelector);
