import React from 'react';
import { EkoPostTargetType } from 'eko-sdk';
import EmptyFeed from '.';

export default {
  title: 'Components/Empty Feed',
};

export const BasicEmptyFeed = ({ targetType }) => <EmptyFeed targetType={targetType} />;

BasicEmptyFeed.argTypes = {
  targetType: { control: { type: 'select', options: Object.values(EkoPostTargetType) } },
};
