import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import Select from '~/core/components/Select';
import CategoryHeader from '~/social/components/category/Header';

import { Selector, SelectIcon, CategorySelectorInput } from './styles';
import CategoryChip from '../category/CategoryChip';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import useCategoriesCollection from '~/social/hooks/collections/useCategoriesCollection';

interface CategorySelectorProps {
  'data-qa-anchor'?: string;
  value?: string[];
  onChange?: (categoryIds: string[]) => void;
  parentContainer?: HTMLElement | null;
}

const CategorySelector = ({
  'data-qa-anchor': dataQaAnchor = '',
  value,
  onChange,
  parentContainer = null,
}: CategorySelectorProps) => {
  const categoryIds = value ?? [];

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const toggle = () => setIsOpen(!isOpen);
  const { formatMessage } = useIntl();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (value: string) => {
    setQuery(value);
    // open dropdown only when there some data in the text input
    setIsOpen(!!value);
    if (value) {
      inputRef.current?.focus();
    }
  };

  const close = () => {
    setQuery('');
    setIsOpen(false);
  };

  const { categories } = useCategoriesCollection({ includeDeleted: false, limit: 100 });
  const options = categories
    .filter((category) => (query ? category.name.includes(query) : true))
    .map((category) => ({
      name: category.name,
      value: category.categoryId,
    }));

  const selectedCategories = categoryIds.map((categoryId) => ({
    name: categories.find((category) => category.categoryId === categoryId)?.name || '',
    value: categoryId,
  }));

  return (
    <Select
      data-qa-anchor={`${dataQaAnchor}-category`}
      value={selectedCategories}
      options={options}
      renderTrigger={({ selected, remove, ...props }) => (
        <Selector {...props} onClick={toggle} data-qa-anchor={`${dataQaAnchor}-category-selector`}>
          {selected.map((selectedItem) => (
            <CategoryChip
              key={selectedItem.value}
              categoryId={selectedItem.value}
              onRemove={() => remove(selectedItem, onChange)}
            />
          ))}
          <CategorySelectorInput
            ref={inputRef}
            data-qa-anchor="category-selector-input"
            type="text"
            value={query}
            placeholder={formatMessage({ id: 'selectACategory' })}
            onChange={(e) => handleChange(e.target.value)}
          />

          <SelectIcon />
        </Selector>
      )}
      renderItem={({ value }) => <CategoryHeader categoryId={value} />}
      parentContainer={parentContainer}
      isOpen={isOpen}
      handleClose={close}
      multiple
      onSelect={({ value }) => {
        setQuery('');
        inputRef.current?.focus();
        onChange?.([...new Set([...categoryIds, value])]);
      }}
    />
  );
};

export default (props: CategorySelectorProps) => {
  const CustomComponentFn = useCustomComponent<CategorySelectorProps>('CategorySelector');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CategorySelector {...props} />;
};
