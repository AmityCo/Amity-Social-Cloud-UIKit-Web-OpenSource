import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import useKeyboard from '~/core/hooks/useKeyboard';
import { MenuItem } from '~/core/components/Menu';
import ConditionalRender from '~/core/components/ConditionalRender';

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

const DefaultRenderer = (item) => <span>{item}</span>;

const Suggestions = ({ items, onPick = () => {}, append, children }) => {
  const list = useRef(null);

  const [active, setActive] = useState(-1);
  const [render = DefaultRenderer] = [].concat(children);

  const onMouseEnter = (key) => () => setActive(key);

  const onMouseLeave = () => setActive(-1);

  const onClick = (key) => () => onPick(key);

  const prev = () => {
    const value = active > 0 ? active - 1 : items.length - 1;

    const { scrollTop, clientHeight: parentHeight } = list.current;
    const selected = list.current.childNodes[value];

    const { offsetTop: childTop, clientHeight: childHeight } = selected;

    if (childTop < scrollTop || childTop + childHeight > scrollTop + parentHeight) {
      list.current.scrollTo(0, childTop);
    }

    setActive(value);
  };

  const next = () => {
    const value = active < items.length - 1 ? active + 1 : 0;

    const { scrollTop, clientHeight: parentHeight } = list.current;
    const selected = list.current.childNodes[value];

    const { offsetTop: childTop, clientHeight: childHeight } = selected;

    if (childTop < scrollTop || childTop + childHeight > scrollTop + parentHeight) {
      list.current.scrollTo(0, childTop + childHeight - parentHeight);
    }

    setActive(value);
  };

  useKeyboard({
    ArrowUp: prev,
    ArrowDown: next,
    Escape: () => setActive(-1),
    Enter: () => onPick(active),
  });

  return (
    <ConditionalRender condition={!!items.length}>
      <MenuList ref={list} onMouseLeave={onMouseLeave}>
        {items.map((item, index) => (
          <MenuItem
            key={`#${index}`}
            hover={index === active}
            onClick={onClick(index)}
            onMouseEnter={onMouseEnter(index)}
          >
            {render(item)}
          </MenuItem>
        ))}
        {append && <MenuItem>{append}</MenuItem>}
      </MenuList>
      <Placeholder>
        <FormattedMessage id="placeholder.noResults" />
      </Placeholder>
    </ConditionalRender>
  );
};

Suggestions.propTypes = {
  items: PropTypes.array.isRequired,
  append: PropTypes.node,
  children: PropTypes.func,
  onPick: PropTypes.func,
};

Suggestions.defaultProps = {
  onPick: () => {},
};

export default Suggestions;
