import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import InputText from '~/core/components/InputText';
import Menu from '~/core/components/Menu';
import Suggestions from '~/core/components/Suggestions';
import Highlight from '~/core/components/Highlight';
import Button from '~/core/components/Button';

import useKeyboard from '~/core/hooks/useKeyboard';
import useActiveElement from '~/core/hooks/useActiveElement';

const Container = styled.div`
  position: relative;
`;

const SuggestionsMenu = styled(Menu)`
  z-index: 10;
  position: absolute;
  top: calc(100% + 0.25rem);
  width: 100%;
  color: ${({ theme }) => theme.palette.base.main};
`;

const defaultRender = (item: string, value: string) => (
  <Highlight key={item} text={item} query={value} />
);
const defaultFilter = (items: string[], value: string) => {
  return items.filter((item) => item.includes(value));

  // return [items].filter((item) => item.includes(value));
};

export const useInputAutocomplete = <T,>({
  value,
  disabled,
}: {
  value?: string;
  disabled?: boolean;
}) => {
  // const defaultActiveTab = Object.keys(items).length > 0 ? `${Object.keys(items)[0]}` : '';
  const [isOpen, setIsOpen] = useState(false);
  // const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [containerRef, isActiveElement] = useActiveElement(isOpen);

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  useEffect(() => {
    if (disabled) return;

    if (value && value.length > 0) {
      setIsOpen(true);
    }
  }, [value, disabled]);

  // handling close on click outside
  useEffect(() => {
    !isActiveElement && close();
  }, [isActiveElement]);

  useKeyboard('Escape', close);

  return {
    isOpen,
    open,
    close,
    containerRef,
  };
};

export interface InputAutocompleteProps {
  'data-qa-anchor'?: string;
  value: string | string[];
  searchValue: string;
  placeholder?: string;
  items: { label: string; value: string }[];
  prepend?: ReactNode;
  append?: ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  loadMore?: () => void;
  renderItem: (item: { label: string; value: string }) => ReactNode;
  onClear?: () => void;
  onChange: (value: string | string[]) => void;
  onSearchValueChange: (searchValue: string) => void;
}

const InputAutocomplete = <T,>({
  'data-qa-anchor': dataQaAnchor = '',
  items,
  value,
  searchValue,
  placeholder,
  loadMore,
  // getPagination,
  prepend,
  append,
  invalid,
  disabled,
  // children,
  renderItem,
  onSearchValueChange,
  onClear,
  onChange,
}: InputAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [containerRef, isActiveElement] = useActiveElement(isOpen);

  const close = () => setIsOpen(false);

  useEffect(() => {
    if (disabled) return;

    if (searchValue.length > 0) {
      setIsOpen(true);
    }
  }, [searchValue, disabled]);

  // handling close on click outside
  useEffect(() => {
    !isActiveElement && close();
  }, [isActiveElement]);

  useKeyboard('Escape', close);

  const onPickSuggestion = (index: number) => {
    onChange?.(items[index].value);

    // we need to pass this to nextTick to avoid reopening
    // the menu due to code in useEffect
    // setTimeout(() => {
    setIsOpen(false);
    // reset value
    onSearchValueChange?.('');
    // }, 0);
  };

  const LoadMoreButton = loadMore && (
    <Button fullWidth onClick={loadMore}>
      <FormattedMessage id="loadMore" />
    </Button>
  );

  return (
    <Container ref={containerRef}>
      <InputText
        data-qa-anchor={dataQaAnchor}
        value={searchValue}
        invalid={invalid}
        disabled={disabled}
        prepend={prepend}
        append={append}
        placeholder={placeholder}
        onClear={onClear}
        onChange={(newValue) => onSearchValueChange?.(newValue.plainText)}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <SuggestionsMenu>
          <Suggestions
            items={items}
            append={LoadMoreButton}
            onPick={onPickSuggestion}
            renderItem={(item) => renderItem(item)}
          />
        </SuggestionsMenu>
      )}
    </Container>
  );
};

export default InputAutocomplete;
