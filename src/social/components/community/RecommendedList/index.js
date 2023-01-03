/* eslint-disable react/jsx-no-useless-fragment */

import React, { memo } from 'react';
import { CommunitySortingMethod } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import { Box, Link, Icon, Skeleton as UISkeleton } from '@noom/wax-component-library';

import HorizontalList from '~/core/components/HorizontalList';
import CommunityCard from '~/social/components/community/Card';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';

const COMMUNITY_FETCH_NUM = 15;
const COLUMN_CONFIG = { 1024: 2, 1280: 3, 1440: 3, 1800: 3 };

const Skeleton = ({ size = 4 }) =>
  new Array(size).fill(1).map((x, index) => <CommunityCard key={index} loading />);

const RecommendedList = ({ category, communityLimit = 5 }) => {
  const { onClickCommunity, onClickCategory } = useNavigation();

  const [communities = [], , , loading] = useCommunitiesList({
    categoryId: category.categoryId,
    sortBy: CommunitySortingMethod.DisplayName,
    limit: COMMUNITY_FETCH_NUM,
  });

  const formattedCommunities = useMemo(
    () => communities.filter((c) => !c.isJoined).slice(0, communityLimit),
    [communities],
  );

  const title = category.name;

  return (
    <>
      <HorizontalList
        title={title}
        subTitle={category.metadata?.description}
        columns={COLUMN_CONFIG}
      >
        {loading && <Skeleton />}

        {!loading &&
          formattedCommunities.map(({ communityId }) => (
            <CommunityCard key={communityId} communityId={communityId} onClick={onClickCommunity} />
          ))}
      </HorizontalList>

      <Box textAlign="right">
        <Link
          colorScheme="secondary"
          textTransform="uppercase"
          fontWeight="bold"
          display="inline-flex"
          alignItems="center"
          onClick={() => onClickCategory(category.categoryId)}
        >
          <FormattedMessage id="collapsible.viewAll" /> <Icon icon="chevron-right" size="lg" />
        </Link>
      </Box>
    </>
  );
};

export const RecommendedListSkeleton = ({ size = 4 }) => (
  <HorizontalList title={<UISkeleton h="1.5rem" w="20rem" />} columns={COLUMN_CONFIG}>
    <Skeleton size={size} />
  </HorizontalList>
);

export default memo(RecommendedList);
