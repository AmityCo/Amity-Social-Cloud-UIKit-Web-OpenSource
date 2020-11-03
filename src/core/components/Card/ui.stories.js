import React from 'react';

import StyledCard from '.';

export default {
  title: 'Ui Only',
};

export const UiCard = ({ title, stretched }) => {
  return (
    <StyledCard title={title} stretched={stretched}>
      <img src="https://cataas.com/cat" alt="" />
    </StyledCard>
  );
};

UiCard.storyName = 'Card box';

UiCard.args = {
  title: 'Some title',
  stretched: false,
};

UiCard.argTypes = {
  title: { control: { type: 'text' } },
  stretched: { control: { type: 'boolean' } },
};
