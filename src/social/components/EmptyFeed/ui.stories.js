import React from 'react';

import { EkoPostTargetType } from 'eko-sdk';

import StyledEmptyFeed from '.';

export default {
  title: 'Ui Only/Social/Feed',
};

export const UiEmptyFeed = ({ targetType }) => <StyledEmptyFeed targetType={targetType} />;

UiEmptyFeed.storyName = 'Empty';

UiEmptyFeed.argTypes = {
  targetType: { control: { type: 'select', options: Object.values(EkoPostTargetType) } },
};
