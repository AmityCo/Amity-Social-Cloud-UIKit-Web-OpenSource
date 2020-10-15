import React from 'react';
import CommunitySearch from '.';

export default {
  title: 'Components/Community/Search',
};

export const Basic = ({ ...args }) => <CommunitySearch {...args} />;

Basic.args = {
  placeholder: 'Search communities',
};

Basic.argTypes = {
  placeholder: { control: { type: 'text' } },
  onSearchResultCommunityClick: { action: 'Clicked community' },
};
