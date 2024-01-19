import React, { memo, useMemo } from 'react';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import CommunityHeader from '~/social/components/community/Header';
import { CommunityScrollContainer } from './styles';
import LoadMoreWrapper from '../LoadMoreWrapper';
import { isNonNullable } from '~/helpers/utils';
import clsx from 'clsx';
import useCommunitiesCollection from '~/social/hooks/collections/useCommunitiesCollection';

const NoResultsMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.base.shade3};
`;

interface CommunitiesListProps {
  className?: string;
  communitiesQueryParam?: Parameters<typeof useCommunitiesList>[0];
  activeCommunity?: string;
}

const CommunitiesList = ({
  className,
  communitiesQueryParam,
  activeCommunity,
}: CommunitiesListProps) => {
  const { onClickCommunity } = useNavigation();
  const { communities, hasMore, loadMore, isLoading, loadMoreHasBeenCalled } =
    useCommunitiesCollection(communitiesQueryParam);

  // If the list is the result of a search, then the list items are displayed differently.
  const isSearchList = communitiesQueryParam && Reflect.has(communitiesQueryParam, 'search');
  const searchInput = communitiesQueryParam?.displayName || '';

  const communityIds = useMemo(() => {
    if (!communities.length) return [];
    return communities.map(({ communityId }) => communityId);
  }, [communities]);

  const noCommunitiesFound = isSearchList && !communityIds.length;
  const classNames = [communityIds.length < 4 ? 'no-scroll' : null, className].filter(
    isNonNullable,
  );

  function renderLoadingSkeleton() {
    return new Array(5).fill(1).map((x, index) => <CommunityHeader key={index} loading />);
  }

  return (
    <CommunityScrollContainer
      className={clsx(classNames)}
      dataLength={communityIds.length}
      next={loadMore}
      hasMore={hasMore}
      // TODO - when infinite scroll is fixed: bring back loading component
      // and remove use of LoadMore button.
      loader={<div />}
    >
      <LoadMoreWrapper
        hasMore={hasMore}
        loadMore={loadMore}
        className="no-border"
        contentSlot={
          <>
            {noCommunitiesFound && (
              <NoResultsMessage>
                <FormattedMessage id="communities.nocommunityfound" />
              </NoResultsMessage>
            )}

            {isLoading && !loadMoreHasBeenCalled && renderLoadingSkeleton()}

            {!isLoading || loadMoreHasBeenCalled
              ? communityIds.map((communityId) => (
                  <CommunityHeader
                    key={communityId}
                    communityId={communityId}
                    isActive={communityId === activeCommunity}
                    isSearchResult={isSearchList}
                    searchInput={searchInput}
                    onClick={() => onClickCommunity(communityId)}
                  />
                ))
              : null}

            {isLoading && loadMoreHasBeenCalled && renderLoadingSkeleton()}
          </>
        }
      />
    </CommunityScrollContainer>
  );
};

export default memo(CommunitiesList);
