import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../hoks/customization';
import { SecondaryButton } from '../commonComponents/Button';

import { EngagementBarContainer, Counters, InteractionBar, LikeIcon, CommentIcon } from './styles';

const EngagementBar = () => {
  const likes = 18928;
  const comments = 345;
  return (
    <EngagementBarContainer>
      <Counters>
        <span>{toHumanString(likes)} likes</span>
        <span>{toHumanString(comments)} comments</span>
      </Counters>
      <InteractionBar>
        <SecondaryButton>
          <LikeIcon /> Like
        </SecondaryButton>
        <SecondaryButton>
          <CommentIcon /> Comment
        </SecondaryButton>
      </InteractionBar>
    </EngagementBarContainer>
  );
};

export default customizableComponent('EngagementBar')(EngagementBar);
