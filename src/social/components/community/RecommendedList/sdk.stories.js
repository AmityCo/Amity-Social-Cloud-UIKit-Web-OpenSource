import React from 'react';
import UiKitRecommendedCommunitiesList from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKRecommendedList = props => <UiKitRecommendedCommunitiesList {...props} />;

SDKRecommendedList.storyName = 'Recommended list';

SDKRecommendedList.args = {
  slim: false,
};

SDKRecommendedList.argTypes = {
  slim: { control: { type: 'boolean' } },
};
