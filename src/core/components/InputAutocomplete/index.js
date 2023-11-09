import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import InputText from '~/core/components/InputText';
import Menu from '~/core/components/Menu';
import Suggestions from '~/core/components/Suggestions';
import Highlight from '~/core/components/Highlight';
import Button from '~/core/components/Button';

import { InputAutocompleteTabs } from './styles';
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

const defaultRender = (item, value) => <Highlight key={item} text={item} query={value} />;
const defaultFilter = (items, value) => items.filter((item) => item.includes(value));

const InputAutocomplete = ({
  'data-qa-anchor': dataQaAnchor = '',
  value,
  setValue,
  placeholder,
  items,
  filter,
  getPagination,
  prepend,
  append,
  invalid,
  disabled,
  children,
  onClear,
  onChange,
  onPick,
}) => {
  const [open, setOpen] = useState(false);

  const startingTab = Object.keys(items).includes('members') ? 'members' : Object.keys(items)[0];
  const [activeTab, setActiveTab] = useState(startingTab);
  const [containerRef, isActiveElement] = useActiveElement(open);
  const close = () => setOpen(false);

  const currentItems = useMemo(() => (!value ? [] : items[activeTab]), [activeTab, items, value]);

  const filtered = useMemo(
    () => (filter ? filter(currentItems, value) : currentItems),
    [value, currentItems, filter],
  );

  useEffect(() => {
    if (disabled) return;

    if (value.length > 0) {
      setOpen(true);
    }
  }, [value, filtered, disabled]);

  // handling close on click outside
  useEffect(() => {
    !isActiveElement && close();
  }, [isActiveElement]);

  useKeyboard({
    Escape: close,
  });

  const onPickSuggestion = (index) => {
    onPick(filtered[index], activeTab);

    // we need to pass this to nextTick to avoid reopening
    // the menu due to code in useEffect
    setTimeout(() => {
      setOpen(false);
      // reset value
      setValue('');
    }, 0);
  };

  const loadMore = getPagination(activeTab);

  const LoadMoreButton = loadMore && (
    <Button fullWidth onClick={loadMore}>
      <FormattedMessage id="loadMore" />
    </Button>
  );

  const [render = defaultRender] = [].concat(children);

  return (
    <Container ref={containerRef}>
      <InputText
        data-qa-anchor={dataQaAnchor}
        value={value}
        invalid={invalid}
        disabled={disabled}
        prepend={prepend}
        append={append}
        placeholder={placeholder}
        onClear={onClear}
        onChange={onChange}
        onClick={() => setOpen(true)}
      />
      {open && (
        <SuggestionsMenu>
          {Object.keys(items).length > 1 && (
            <InputAutocompleteTabs
              tabs={Object.keys(items).map((key) => ({
                value: key,
                label: key,
              }))}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          )}

          <Suggestions items={filtered} append={LoadMoreButton} onPick={onPickSuggestion}>
            {(item) => render(item, value, activeTab)}
          </Suggestions>
        </SuggestionsMenu>
      )}
    </Container>
  );
};

InputAutocomplete.defaultProps = {
  items: [],
  filter: defaultFilter,
  invalid: false,
  disabled: false,
  onPick: () => {},
  placeholder: '',
};

InputAutocomplete.propTypes = {
  'data-qa-anchor': PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  items: PropTypes.object,
  filter: PropTypes.func,
  getPagination: PropTypes.func,
  prepend: PropTypes.node,
  append: PropTypes.node,
  invalid: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.func,
  onClear: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onPick: PropTypes.func,
};

export default InputAutocomplete;
