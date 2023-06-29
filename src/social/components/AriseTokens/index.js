import React, { memo } from 'react';
// import React, { memo, useState } from 'react';
// import EmptyState from '~/core/components/EmptyState';
import customizableComponent from '~/core/hocs/customization';

import { AriseTokensContainer } from './styles';

const AriseTokensGallery = ({ userId }) => {
  return (
    <AriseTokensContainer>
      <h1>Arise Tokens for: {userId}</h1>
    </AriseTokensContainer>
  );
};

export default memo(customizableComponent('AriseTokensGallery', AriseTokensGallery));
