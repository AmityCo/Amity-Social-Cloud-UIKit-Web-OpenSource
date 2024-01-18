import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import useKeyboard from '~/core/hooks/useKeyboard';
import { MenuItem } from '~/core/components/Menu';

const MenuList = styled.div`
  flex: 1 1 auto;
  z-index: 1;
  position: relative;
  display: block;
  overflow-y: auto;
  min-height: 3em;
  max-height: 200px;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
`;

const Placeholder = styled.div`
  flex: 1 1 auto;
  z-index: 1;
  position: relative;
  background: #fff;
  padding: 18px 72px 18px 72px;
  color: ${({ theme }) => theme.palette.base.shade3};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const DefaultRenderer = (item) => <span>{item}</span>;

interface SuggestionsProps<T> {
  items: T[];
  append?: React.ReactNode;
  renderItem?: (item: T) => React.ReactNode;
  onPick?: (index: number) => void;
}

const Suggestions = <T,>({
  items,
  onPick = () => {},
  append,
  renderItem = (item) => <span>{item}</span>,
}: SuggestionsProps<T>) => {
  const list = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(-1);
  // const [render = DefaultRenderer] = [].concat(children);

  const onMouseEnter = (key: number) => () => setActive(key);

  const onMouseLeave = () => setActive(-1);

  const onClick = (key: number) => () => onPick(key);

  const prev = () => {
    if (list.current == null) return;
    const value = active > 0 ? active - 1 : items.length - 1;

    const { scrollTop, clientHeight: parentHeight } = list.current;
    const selected = list.current.children[value];

    // const { offsetTop: childTop, clientHeight: childHeight } = selected;
    const childTop = selected?.clientTop || 0;
    const childHeight = selected?.clientHeight || 0;

    if (childTop < scrollTop || childTop + childHeight > scrollTop + parentHeight) {
      list.current.scrollTo(0, childTop);
    }

    setActive(value);
  };

  const next = () => {
    if (list.current == null) return;
    const value = active < items.length - 1 ? active + 1 : 0;

    const { scrollTop, clientHeight: parentHeight } = list.current;
    // const selected = list.current.childNodes[value];
    const selected = list.current.children[value];

    // const { offsetTop: childTop, clientHeight: childHeight } = selected;
    const childTop = selected?.clientTop || 0;
    const childHeight = selected?.clientHeight || 0;

    if (childTop < scrollTop || childTop + childHeight > scrollTop + parentHeight) {
      list.current.scrollTo(0, childTop + childHeight - parentHeight);
    }

    setActive(value);
  };

  useKeyboard('ArrowUp', prev);
  useKeyboard('ArrowDown', next);
  useKeyboard('Escape', () => setActive(-1));
  useKeyboard('Enter', () => onPick?.(active));
  // useKeyboard({
  //   ArrowUp: prev,
  //   ArrowDown: next,
  //   Escape: () => setActive(-1),
  //   Enter: () => onPick?.(active),
  // });

  return items.length ? (
    <MenuList ref={list} onMouseLeave={onMouseLeave}>
      {items.map((item, index) => (
        <MenuItem
          key={`#${index}`}
          hover={index === active}
          onClick={onClick(index)}
          onMouseEnter={onMouseEnter(index)}
        >
          {renderItem(item)}
        </MenuItem>
      ))}
      {append && <MenuItem>{append}</MenuItem>}
    </MenuList>
  ) : (
    <Placeholder data-qa-anchor="suggestions-placeholder-no-results">
      <FormattedMessage id="placeholder.noResults" />
    </Placeholder>
  );
};

export default Suggestions;
