import React from 'react';
import ExplorePage from '.';

export default {
  title: 'Sdk connected/Social',
};

export const SdkExplorePage = props => (
  <div
    style={{
      maxWidth: '930px',
    }}
  >
    <ExplorePage {...props} />
  </div>
);

SdkExplorePage.argTypes = {
  onClickCommunity: { action: 'onClickCommunity(communityId)' },
  onCommunityCreated: { action: 'onCommunityCreated(communityId)' },
  onClickCategory: { action: 'onClickCategory(categoryId)' },
};

SdkExplorePage.storyName = 'Explore page';
