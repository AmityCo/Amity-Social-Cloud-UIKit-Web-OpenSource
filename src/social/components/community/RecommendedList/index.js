/* eslint-disable react/jsx-no-useless-fragment */

import React, { memo } from 'react';

import { FormattedMessage } from 'react-intl';

import HorizontalList from '~/core/components/HorizontalList';
import Skeleton from '~/core/components/Skeleton';
import CommunityCard from '~/social/components/community/Card';

import useRecommendedCommunitiesList from '~/social/hooks/useRecommendedCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';

const RecommendedList = () => {
  const { onClickCommunity } = useNavigation();
  const [communities, , , loading] = useRecommendedCommunitiesList();

  const title = loading ? (
    <Skeleton style={{ fontSize: 12, maxWidth: 156 }} />
  ) : (
    <FormattedMessage id="recommendedList" />
  );

  if (!communities?.length) return null;

  return (
    <HorizontalList title={title}>
      {loading && new Array(4).fill(1).map((x, index) => <CommunityCard key={index} loading />)}

      {!loading &&
        communities
          .slice(0, 4)
          .map(({ communityId }) => (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          ))}
    </HorizontalList>
  );
};

export default memo(RecommendedList);
