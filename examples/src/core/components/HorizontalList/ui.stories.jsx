import React from 'react';
import styled from 'styled-components';

import StyledHList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/HorizontalList',
};

const Item = styled.div`
  width: 10em;
  height: 12em;
  padding: 1em;
  border: 1px solid #eee;

  &:before {
    content: attr(title);
  }
`;

export const UiHList = {
  render: () => {
    const [{ count }] = useArgs();
    const items = Array(count)
      .fill(0)
      .map((_, i) => <Item key={`#${i}`} title={`item#${i}`} />);

    return <StyledHList>{items}</StyledHList>;
  },

  name: 'Simple list',

  args: {
    count: 10,
  },

  argTypes: {
    count: { control: { type: 'number', min: 0, step: 1 } },
  },
};

const Frame = styled.div`
  width: 75vw;
  height: 75vh;
  overflow: hidden;
`;

const CatItem = styled.img.attrs({ loading: 'lazy' })`
  width: 8em;
  height: 8em;
  object-position: center;
  object-fit: contains;
`;

export const UiCatList = {
  render: () => {
    const [{ count }] = useArgs();
    const items = Array(count)
      .fill(0)
      .map((_, i) => <CatItem key={`#${i}`} src={`https://cataas.com/cat?nocache=${i}`} />);

    return (
      <Frame>
        <StyledHList>{items}</StyledHList>
      </Frame>
    );
  },

  name: 'In a closed frame',

  args: {
    count: 10,
  },

  argsTypes: {
    count: { control: { type: 'number', min: 0, step: 1 } },
  },
};
