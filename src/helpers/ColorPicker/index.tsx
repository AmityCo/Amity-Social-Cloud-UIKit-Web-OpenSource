import React from 'react';
import styled from 'styled-components';
import { readableColor } from 'polished';
import { COLOR_SHADES, lightenHex } from '~/core/providers/UiKitProvider/theme/palette';

const getShadeName = (tileIndex: number) => {
  if (tileIndex === 0) return 'Main';
  return `Shade ${tileIndex}`;
};

const ColorTile = styled.div.attrs<{
  tileIndex: number;
  targetColor: Parameters<typeof readableColor>[0];
}>(({ tileIndex, targetColor }) => ({
  children: getShadeName(tileIndex),
  style: {
    background: targetColor,
    color: readableColor(targetColor),
  },
}))`
  height: 100px;
  width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const TilesContainer = styled.div`
  display: flex;
`;

const ColorPicker = ({ mainColor }: { mainColor: string }) => {
  return (
    <TilesContainer>
      {[0, ...COLOR_SHADES].map((shade, index) => {
        const targetColor = lightenHex(shade, mainColor);
        return <ColorTile key={shade.toString()} tileIndex={index} targetColor={targetColor} />;
      })}
    </TilesContainer>
  );
};

export default ColorPicker;
