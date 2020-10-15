import React, { useState } from 'react';

import CommunitiesList from '.';

export default {
  title: 'Components/Community/List',
  parameters: { layout: 'centered' },
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
    <CommunitiesList
      communitiesQueryParam={queryParams}
      onClickCommunity={handeClickCommunity}
      getIsCommunityActive={getIsCommunityActive}
    />
  );
};

SDKCommunitiesList.args = {
  querySearch: '',
  onlyShowJoined: false,
};

SDKCommunitiesList.argTypes = {
  querySearch: { control: { type: 'text' } },
  onlyShowJoined: { control: { type: 'boolean' } },
  onClickCommunity: { action: 'Clicked community with Id' },
};
