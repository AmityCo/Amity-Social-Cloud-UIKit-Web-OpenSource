import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import styled from 'styled-components';

import EmptyState from '~/core/components/EmptyState';
import Button from '~/core/components/Button';
import { NewspaperLight, Search } from '~/icons';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const FeedIcon = styled(NewspaperLight).attrs<{ icon?: ReactNode }>({ width: 48, height: 48 })`
  margin: 10px;
`;

const ExploreLink = styled(Button)`
  font-size: 14px;
  margin-top: 8px;
`;

const SearchIcon = styled(Search).attrs<{ icon?: ReactNode }>({ width: 16, height: 16 })`
  margin-right: 6px;
`;

const getFeedTypesEmptyText = (targetType?: string) => {
  switch (targetType) {
    case 'globalFeed':
    case 'global':
      return () => 'feed.emptyFeed';
    case 'communityFeed':
    case 'community':
      return (canPost: boolean, communityFeedType?: string) => {
        if (communityFeedType === 'reviewing') {
          return 'feed.emptyCommunityReviewingFeed';
        }

        return canPost ? 'feed.emptyJoinedCommunityPublicFeed' : 'feed.emptyCommunityPublicFeed';
      };
    case 'userFeed':
    case 'user':
      return () => 'feed.emptyUserFeed';
    case 'myFeed':
      return () => 'feed.emptyMyFeed';
    default:
      return () => 'feed.emptyFeed';
  }
};

interface EmptyFeedProps {
  targetType?: string;
  canPost?: boolean;
  className?: string;
  feedType?: string;
  goToExplore?: () => void;
}

const EmptyFeed = ({
  targetType,
  canPost = false,
  className = undefined,
  feedType = undefined,
  goToExplore,
}: EmptyFeedProps) => (
  <EmptyState
    className={className}
    title={<FormattedMessage id={getFeedTypesEmptyText(targetType)?.(canPost, feedType)} />}
    icon={<FeedIcon />}
  >
    {goToExplore && (
      <ExploreLink onClick={goToExplore}>
        <SearchIcon />
        <FormattedMessage id="community.exploreCommunities" />
      </ExploreLink>
    )}
  </EmptyState>
);

export default (props: EmptyFeedProps) => {
  const CustomComponentFn = useCustomComponent<EmptyFeedProps>('EmptyFeed');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <EmptyFeed {...props} />;
};
