import React from 'react';
import styled from 'styled-components';

import Square from '.';

export default {
  title: 'Ui Only',
};

const Constraint = styled.div`
  width: 20vw;
`;

const LoremIpsum = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid royalblue;
  padding: 1rem;
  ${({ theme }) => theme.typography.body}
  overflow: auto;
`;

export const UiSquare = (props) => {
  return (
    <Constraint>
      <Square {...props}>
        <LoremIpsum>
          いろはにほへとちりぬるを わかよたれそつねならむ うゐのおくやまけふこえて
          あさきゆめみしゑひもせす 色は匂へど散りぬるを 我が世誰ぞ常ならむ 有為の奥山今日越えて
          浅き夢見じ酔ひもせず
        </LoremIpsum>
      </Square>
    </Constraint>
  );
};

UiSquare.storyName = 'Square';

UiSquare.args = {
  ratio: 1,
};

UiSquare.argTypes = {
  ratio: { control: { type: 'range', min: 0, max: 1, step: 0.001 } },
};
