import React from 'react';
import { FormattedMessage } from 'react-intl';

import { toHumanString } from '~/helpers/toHumanString';
import {
  PendingPostsBannerContainer,
  PendingPostsBannerMessage,
  PendingPostsBannerTitle,
  PendingPostsBannerTitleBadge,
} from './styles';

export const PendingPostsBanner = ({ canReviewPosts, postsCount }) => {
  return (
    <PendingPostsBannerContainer>
      <PendingPostsBannerTitle>
        <PendingPostsBannerTitleBadge />
        <FormattedMessage id="community.pendingPostsBanner.title" />
      </PendingPostsBannerTitle>

      <PendingPostsBannerMessage>
        {canReviewPosts ? (
          <FormattedMessage
            id="community.pendingPostsBanner.needApproval"
            values={{
              amount: postsCount,
              formattedAmount: toHumanString(postsCount),
            }}
          />
        ) : (
          <FormattedMessage id="community.pendingPostsBanner.pendingForReview" />
        )}
      </PendingPostsBannerMessage>
    </PendingPostsBannerContainer>
  );
};
