import React from 'react';
import styled from 'styled-components';

import Square from '~/core/components/Square';

const Gallery = styled.div<{ count?: number }>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  grid-auto-flow: row;
`;

export const ExpandedGridCell = styled(Square)`
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
  ${({ onClick }) => onClick && 'cursor: pointer;'}

  &:hover {
    z-index: 2;
  }
`;

interface ExpandedGridProps<T extends Amity.Post> {
  className?: string;
  items: T[];
  itemKey?: keyof T;
  onClick?: (index: number) => void;
  renderItem: (item: T) => React.ReactNode;
}

const ExpandedGrid = <T extends Amity.Post>({
  className,
  onClick,
  renderItem,
  items = [],
  itemKey,
}: ExpandedGridProps<T>) => {
  return (
    <Gallery className={className} count={items.length}>
      {items.map((item, index) => (
        <ExpandedGridCell
          key={`#${itemKey ? item[itemKey] : index}`}
          onClick={() => onClick?.(index)}
        >
          {renderItem(item)}
        </ExpandedGridCell>
      ))}
    </Gallery>
  );
};

export default ExpandedGrid;
