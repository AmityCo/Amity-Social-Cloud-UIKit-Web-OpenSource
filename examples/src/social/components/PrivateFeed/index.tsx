import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  PrivateFeedContainer,
  LockIcon,
  PrivateFeedTitle,
  PrivateFeedBody,
  LockIconContainer,
} from './styles';

const PrivateFeed = () => {
  return (
    <PrivateFeedContainer>
      <LockIconContainer>
        <LockIcon />
      </LockIconContainer>
      <PrivateFeedTitle>
        <FormattedMessage id="privateFeed.title" />
      </PrivateFeedTitle>
      <PrivateFeedBody>
        <FormattedMessage id="privateFeed.body" />
      </PrivateFeedBody>
    </PrivateFeedContainer>
  );
};

export default PrivateFeed;
