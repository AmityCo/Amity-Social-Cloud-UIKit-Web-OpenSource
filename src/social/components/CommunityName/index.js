import React from 'react';

import { NameContainer, Name, VervifiedIcon, PrivateIcon } from './styles';

const CommunityName = ({ className, community }) => (
  <NameContainer className={className}>
    {!community.isPublic && <PrivateIcon />}
    <Name title={community.name}>{community.name}</Name>
    {community.verified && <VervifiedIcon />}
  </NameContainer>
);

export default CommunityName;
