import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';

import ConditionalRender from '~/core/components/ConditionalRender';

import Square from '~/core/components/Square';
import { ImageRenderer } from './styles';

/*
  Here's the math for the CSS grid-template-rows.
  -----------------------------------------------
  
  The grid is built with a design constraint of a height/width ratio of 0.75,
  meaning that for given width, the height will always be 75% of that width.

  By an other design constraint, the 2nd row's height should be 33% of the grid's
  width to ensure that we always have square tiles when the layout has 4 images:

  +--------+
  |        | <-- first row, full width, flexible height
  |        | 
  +--------+
  |  |  |  | <-- second row, when 3 cells, the cells should look square
  +--------+

  To do that, we need to define the height of the 2nd row as "33% of the width" with using only the height.
  Hopefully, since the ratio is fixed (r = h/w) we can permute the formula to find "w" depending on "h"

  r = h / w
  => w = h / r

  As r = .75 and because we want the height to be 1/3 of the width which is 100%,
  the final formula is:
  
  height = ((width / 3) / ratio)
  => ((100% / 3) / .75)
*/

const Gallery = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 1fr calc((100% / 3) / 0.75);
  grid-gap: 0.5rem;
  border-radius: 4px;

  &.one > :nth-child(1) {
    grid-column: 1 / 7;
    grid-row: 1 / 3;
  }

  &.two > :nth-child(1) {
    grid-column: 1 / 4;
    grid-row: 1 / 3;
  }

  &.two > :nth-child(2) {
    grid-column: 4 / 7;
    grid-row: 1 / 3;
  }

  &.three > :nth-child(1),
  &.four > :nth-child(1),
  &.many > :nth-child(1) {
    grid-column: 1 / 7;
    grid-row: 1 / 2;
  }

  &.three > :nth-child(2) {
    grid-column: 1 / 4;
    grid-row: 2 / 3;
  }

  &.three > :nth-child(3) {
    grid-column: 4 / 7;
    grid-row: 2 / 3;
  }

  &.four > :nth-child(2),
  &.many > :nth-child(2) {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }

  &.four > :nth-child(3),
  &.many > :nth-child(3) {
    grid-column: 3 / 5;
    grid-row: 2 / 3;
  }

  &.four > :nth-child(4),
  &.many > :nth-child(4) {
    grid-column: 5 / 7;
    grid-row: 2 / 3;
  }
`;

const Cell = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  ${({ onClick }) => onClick && 'cursor: pointer;'}

  &:hover {
    z-index: 2;
  }
`;

const Overlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  ${({ theme }) => theme.typography.headline};
  pointer-events: none;
`;

const TruncatedGrid = ({ className, items, onClick, children, itemKeyProp }) => {
  const [render = ImageRenderer] = [].concat(children);
  const { length } = items;

  const handleClick = (index) => (onClick ? () => onClick(index) : null);

  const config =
    {
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
    }[length] ?? 'many';

  return (
    <Square ratio={0.75} className={className}>
      <Gallery className={cx(config)} count={length}>
        {items.slice(0, 3).map((item, index) => (
          <Cell key={`#${itemKeyProp ? item[itemKeyProp] : index}`} onClick={handleClick(index)}>
            {render(item)}
          </Cell>
        ))}

        {length >= 4 && (
          <Cell key={`#${itemKeyProp ? items[3][itemKeyProp] : 4}`} onClick={handleClick(3)}>
            {render(items[3])}
            <ConditionalRender condition={length > 4}>
              <Overlay>+{length - 4}</Overlay>
            </ConditionalRender>
          </Cell>
        )}
      </Gallery>
    </Square>
  );
};

export default TruncatedGrid;
