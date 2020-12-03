import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import customizableComponent from '~/core/hocs/customization';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import {
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  SearchIconContainer,
} from './styles';

const CommunitySearch = ({ className, onClickCommunity, sticky = false }) => {
  const [value, setValue] = useState('');
  const [communities, hasMore, loadMore] = useCommunitiesList({ search: value });
  const handleChange = newVal => {
    setValue(newVal);
  };

  return (
    <CommunitiesSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <CommunitiesSearchInput
            value={value}
            items={communities.map(community => community.displayName)}
            onChange={handleChange}
            onPick={onClickCommunity}
            className={className}
            loadMore={hasMore && loadMore}
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
  onClickCommunity: PropTypes.func,
  sticky: PropTypes.bool,
};

CommunitySearch.defaultProps = {
  sticky: false,
};

export default customizableComponent('CommunitySearch', CommunitySearch);
