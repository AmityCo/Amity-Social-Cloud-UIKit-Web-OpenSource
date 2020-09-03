import React from 'react';

import { NameContainer, Name, VervifiedIcon, PrivateIcon } from './styles';

const CommunityName = ({ className, community }) => (
  <NameContainer className={className}>
    {community.isPrivate && <PrivateIcon />}
    <Name title={community.name}>{community.name}</Name>
    {community.verified && <VervifiedIcon />}
  </NameContainer>
);

export default CommunityName;
