import millify from 'millify';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  PendingPostsBannerContainer,
  PendingPostsBannerMessage,
  PendingPostsBannerTitle,
  PendingPostsBannerTitleBadge,
} from './styles';

interface PendingPostBannerProps {
  canReviewPosts: boolean;
  postsCount: number;
}

export const PendingPostsBanner = ({ canReviewPosts, postsCount }: PendingPostBannerProps) => {
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
              formattedAmount: millify(postsCount),
            }}
          />
        ) : (
          <FormattedMessage id="community.pendingPostsBanner.pendingForReview" />
        )}
      </PendingPostsBannerMessage>
    </PendingPostsBannerContainer>
  );
};
