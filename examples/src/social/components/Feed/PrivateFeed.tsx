import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  LockIcon,
  PrivateFeedContainer,
  PrivateFeedTitle,
  PrivateFeedBody,
  TextContainer,
} from './styles';

const PrivateFeed = () => {
  return (
    <PrivateFeedContainer>
      <LockIcon />
      <TextContainer>
        <PrivateFeedTitle>
          <FormattedMessage id="feed.private.title" />
        </PrivateFeedTitle>
        <PrivateFeedBody>
          <FormattedMessage id="feed.private.body" />
        </PrivateFeedBody>
      </TextContainer>
    </PrivateFeedContainer>
  );
};

export default PrivateFeed;
