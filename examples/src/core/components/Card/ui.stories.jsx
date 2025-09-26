import React from 'react';

import StyledCard from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

export const UiCard = {
  render: () => {
    const [{ title, stretched }] = useArgs();
    return (
      <StyledCard title={title} stretched={stretched}>
        <img src="https://cataas.com/cat" alt="" />
      </StyledCard>
    );
  },

  name: 'Card box',

  args: {
    title: 'Some title',
    stretched: false,
  },

  argTypes: {
    title: { control: { type: 'text' } },
    stretched: { control: { type: 'boolean' } },
  },
};
