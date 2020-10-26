import React from 'react';
import { toHumanString } from 'human-readable-numbers';
import Truncate from 'react-truncate-markup';
import customizableComponent from '~/core/hocs/customization';
import CommunityName from '~/social/components/CommunityName';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import { Avatar, CommunityItem, Description, Count } from './styles';

const Community = ({ community, onClick }) => (
  <CommunityItem onClick={onClick}>
    <Avatar avatar={community.avatar} backgroundImage={CommunityImage} />
    <CommunityName community={community} />
    <div>
      <Count>{toHumanString(community.postsCount)}</Count> posts
    </div>
    <Truncate lines={3}>
      <Description>{community.description}</Description>
    </Truncate>
  </CommunityItem>
);

export default customizableComponent('Community', Community);
