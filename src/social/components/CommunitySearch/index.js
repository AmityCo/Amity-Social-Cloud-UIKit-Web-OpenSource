import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Highlight from '~/core/components/Highlight';
import Skeleton from '~/core/components/Skeleton';

import customizableComponent from '~/core/hocs/customization';
import useDebounce from '~/core/hooks/useDebounce';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  SearchIconContainer,
} from './styles';

const CommunitySearch = ({ className, sticky = false }) => {
  const { onClickCommunity } = useNavigation();
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 100);

  const [communities, hasMore, loadMore, loading, loadingMore] = useCommunitiesList({
    search: debouncedValue,
  });
  const handleChange = newVal => {
    setValue(newVal);
  };

  const handlePick = ({ communityId, skeleton }) => {
    if (!skeleton && communityId) {
      onClickCommunity(communityId);
    }
  };

  const items = useMemo(() => {
    function getLoadingItems() {
      return new Array(5).fill(1).map((x, index) => ({ communityId: index, skeleton: true }));
    }

    if (loading) {
      return getLoadingItems();
    }

    if (!loadingMore) {
      return communities;
    }

    return [...communities, ...getLoadingItems()];
  }, [communities, loading, loadingMore]);

  return (
    <CommunitiesSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <CommunitiesSearchInput
            value={value}
            items={items}
            filter={null}
            onChange={handleChange}
            onPick={handlePick}
            loadMore={hasMore ? loadMore : undefined}
            placeholder={placeholder}
            prepend={
              <SearchIconContainer>
                <SearchIcon />
              </SearchIconContainer>
            }
          >
            {(item, query) =>
              item.skeleton ? (
                <div style={{ width: '100%' }}>
                  <Skeleton key={item.communityId} style={{ fontSize: '0.75rem' }} />
                </div>
              ) : (
                <Highlight key={item.communityId} text={item.displayName} query={query} />
              )
            }
          </CommunitiesSearchInput>
        )}
      </FormattedMessage>
    </CommunitiesSearchContainer>
  );
};

CommunitySearch.propTypes = {
  className: PropTypes.string,
  sticky: PropTypes.bool,
};

CommunitySearch.defaultProps = {
  sticky: false,
};

export default memo(customizableComponent('CommunitySearch', CommunitySearch));
