import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import customizableComponent from '~/core/hocs/customization';
import Select from '~/core/components/Select';
import useCategories from '~/social/hooks/useCategories';
import CategoryHeader from '~/social/components/category/Header';
import ChevronDown from '~/icons/ChevronDown';

import { Selector, ChevronDownContainer, InputPlaceholder } from './styles';

const CategorySelector = ({ value: categoryId, onChange, parentContainer = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const [categories] = useCategories({ isDeleted: false });
  const options = categories.map((category) => ({
    name: category.name,
    value: category.categoryId,
  }));

  const itemRenderer = ({ value }) => <CategoryHeader categoryId={value} />;

  const triggerRenderer = (props) => {
    return (
      <Selector {...props}>
        {categoryId ? (
          <CategoryHeader categoryId={categoryId} />
        ) : (
          <FormattedMessage id="selectACategory">
            {(placeholder) => <InputPlaceholder>{placeholder}</InputPlaceholder>}
          </FormattedMessage>
        )}
        <ChevronDownContainer>
          <ChevronDown height={16} width={16} />
        </ChevronDownContainer>
      </Selector>
    );
  };

  return (
    <Select
      options={options}
      renderTrigger={(props) => triggerRenderer({ ...props, onClick: toggle })}
      renderItem={itemRenderer}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      onSelect={({ value }) => onChange(value)}
    />
  );
};

CategorySelector.propTypes = {
  value: PropTypes.string,
  parentContainer: PropTypes.instanceOf(Element),
  onChange: PropTypes.func,
};

export default customizableComponent('CategorySelector', CategorySelector);
