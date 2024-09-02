import React, { memo } from 'react';

import { FormattedMessage } from 'react-intl';

import HorizontalList from '~/core/components/HorizontalList';
import Skeleton from '~/core/components/Skeleton';
import CommunityCard, { UICommunityCard } from '~/social/components/community/Card';
import useRecommendedCommunitiesCollection from '~/social/hooks/collections/useRecommendedCommunitiesCollection';

import { useNavigation } from '~/social/providers/NavigationProvider';

const RecommendedList = () => {
  const { onClickCommunity } = useNavigation();
  const { communities, isLoading } = useRecommendedCommunitiesCollection();

  const title = isLoading ? (
    <Skeleton style={{ fontSize: 12, maxWidth: 156 }} />
  ) : (
    <FormattedMessage id="recommendedList" />
  );

  if (!communities?.length) return null;

  return (
    <HorizontalList
      title={title}
      columns={{
        1024: 2,
        1280: 3,
      }}
    >
      {isLoading && new Array(4).fill(1).map((x, index) => <UICommunityCard key={index} loading />)}

      {!isLoading &&
        communities.map(({ communityId }) => (
          <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
        ))}
    </HorizontalList>
  );
};

export default memo(RecommendedList);
