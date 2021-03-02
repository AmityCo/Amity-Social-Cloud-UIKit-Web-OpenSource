import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
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
  const [communities, hasMore, loadMore] = useCommunitiesList({ search: value });
  const handleChange = newVal => {
    setValue(newVal);
  };

  const handlePick = communityName => {
    const { communityId } = communities.find(item => item.displayName === communityName) ?? {};
    communityId && onClickCommunity(communityId);
  };

  return (
    <CommunitiesSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <CommunitiesSearchInput
            value={value}
            items={communities.map(community => community.displayName)}
            filter={null}
            onChange={handleChange}
            onPick={handlePick}
            className={className}
            loadMore={hasMore ? loadMore : undefined}
            placeholder={placeholder}
            prepend={
              <SearchIconContainer>
                <SearchIcon />
              </SearchIconContainer>
            }
          />
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

export default customizableComponent('CommunitySearch', CommunitySearch);
