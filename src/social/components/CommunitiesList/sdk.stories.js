import React, { useState } from 'react';

import UiKitCommunitiesList from '.';

export default {
  title: 'SDK Connected/Social/Community',
};

export const SDKCommunitiesList = ({
  onClickCommunity,
  communitiesQueryParam,
  querySearch,
  onlyShowJoined,
}) => {
  const [activeCommunity, setActiveCommunity] = useState(null);
  const handeClickCommunity = communityId => {
    onClickCommunity(communityId);
    setActiveCommunity(communityId);
  };
  const getIsCommunityActive = communityId => communityId === activeCommunity;

  const queryParams = { ...communitiesQueryParam };
  if (onlyShowJoined) {
    queryParams.isJoined = true;
  }

  if (querySearch) {
    queryParams.search = querySearch;
  }

  return (
    <UiKitCommunitiesList
      communitiesQueryParam={queryParams}
      onClickCommunity={handeClickCommunity}
      getIsCommunityActive={getIsCommunityActive}
    />
  );
};

SDKCommunitiesList.storyName = 'Communities list';

SDKCommunitiesList.args = {
  querySearch: '',
  onlyShowJoined: false,
};

SDKCommunitiesList.argTypes = {
  querySearch: { control: { type: 'text' } },
  onlyShowJoined: { control: { type: 'boolean' } },
  onClickCommunity: { action: 'onClickCommunity()' },
};
