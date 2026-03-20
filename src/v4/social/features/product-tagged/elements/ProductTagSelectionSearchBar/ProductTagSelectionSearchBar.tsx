import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ELEMENT_ID } from '~/v4/constants/customization';
import { SearchInput } from '~/v4/core/components/SearchInput';

export type ProductTagSelectionSearchBarProps = {
  pageId?: string;
  componentId?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
};

export function ProductTagSelectionSearchBar({
  pageId = '*',
  componentId = '*',
  value,
  onChange,
  onFocus,
  onClear,
}: ProductTagSelectionSearchBarProps) {
  const elementId = ELEMENT_ID.PRODUCT_TAG_SELECTION_SEARCH_BAR;
  const { config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <SearchInput
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      value={value}
      onChange={onChange}
      placeholder={(config?.placeholder as string) ?? 'Search by product name'}
      onFocus={onFocus}
      onClear={onClear}
    />
  );
}
