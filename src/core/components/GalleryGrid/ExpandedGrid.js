import React from 'react';
import styled from 'styled-components';

import Square from '~/core/components/Square';
import { ImageRenderer } from './styles';

const Gallery = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  grid-auto-flow: row;
`;

const Cell = styled(Square)`
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
  ${({ onClick }) => onClick && 'cursor: pointer;'}

  &:hover {
    z-index: 2;
  }
`;

const ExpandedGrid = ({ className, items, onClick, children, itemKeyProp }) => {
  const [render = ImageRenderer] = [].concat(children);
  const { length } = items;

  const handleClick = index => (onClick ? () => onClick(index) : null);

  return (
    <Gallery className={className} count={length}>
      {items.map((item, index) => (
        <Cell key={`#${itemKeyProp ? item[itemKeyProp] : index}`} onClick={handleClick(index)}>
          {render(item)}
        </Cell>
      ))}
    </Gallery>
  );
};

export default ExpandedGrid;
