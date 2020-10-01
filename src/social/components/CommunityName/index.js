import React from 'react';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import { NameContainer, Name, VerifiedIcon, PrivateIcon } from './styles';

const CommunityName = ({ className, community }) => (
  <NameContainer className={className}>
    <ConditionalRender condition={!community.isPublic}>
      <PrivateIcon />
    </ConditionalRender>
    <Name title={community.name}>{community.name}</Name>
    <ConditionalRender condition={community.verified}>
      <VerifiedIcon />
    </ConditionalRender>
  </NameContainer>
);

export default CommunityName;
