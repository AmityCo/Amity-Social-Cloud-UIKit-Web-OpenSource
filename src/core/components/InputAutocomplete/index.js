import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import InputText from '~/core/components/InputText';
import Menu from '~/core/components/Menu';
import Suggestions from '~/core/components/Suggestions';
import Highlight from '~/core/components/Highlight';
import Button from '~/core/components/Button';

const MIN_LENGTH_FOR_SUGGESTIONS = 1;

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
const defaultFilter = (items, value) => items.filter(item => item.includes(value));

const InputAutocomplete = ({
  className,
  value,
  placeholder,
  items,
  filter,
  loadMore,
  expand,
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

  const filtered = useMemo(() => (filter ? filter(items, value) : items), [value, items, filter]);

  useEffect(() => {
    if (disabled) return;

    if (value?.length <= expand - 1 || (items.length === 1 && value === items[0])) {
      setOpen(false);
    } else {
      setOpen(!!filtered.length);
    }
  }, [value, filtered]);

  const onPickSuggestion = index => {
    onPick(filtered[index]);

    // we need to pass this to nextTick to avoid reopening
    // the menu due to code in useEffect
    setTimeout(() => setOpen(false), 0);
  };

  const LoadMoreButton = loadMore && (
    <Button fullWidth onClick={loadMore}>
      <FormattedMessage id="loadMore" />
    </Button>
  );

  const [render = defaultRender] = [].concat(children);

  return (
    <Container className={className}>
      <InputText
        value={value}
        invalid={invalid}
        disabled={disabled}
        prepend={prepend}
        append={append}
        onClear={onClear}
        onChange={onChange}
        placeholder={placeholder}
      />
      {open && (
        <SuggestionsMenu>
          <Suggestions items={filtered} append={LoadMoreButton} onPick={onPickSuggestion}>
            {item => render(item, value)}
          </Suggestions>
        </SuggestionsMenu>
      )}
    </Container>
  );
};

InputAutocomplete.defaultProps = {
  className: undefined,
  items: [],
  filter: defaultFilter,
  expand: MIN_LENGTH_FOR_SUGGESTIONS,
  invalid: false,
  disabled: false,
  onPick: () => {},
  placeholder: '',
};

InputAutocomplete.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  items: PropTypes.array,
  filter: PropTypes.func,
  loadMore: PropTypes.func,
  expand: PropTypes.number,
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
