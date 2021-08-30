import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import CommunityHeader from '~/social/components/community/Header';
import UserHeader from '~/social/components/UserHeader';
import customizableComponent from '~/core/hocs/customization';
import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import { useNavigation } from '~/social/providers/NavigationProvider';
import {
  SocialSearchContainer,
  SocialSearchInput,
  SearchIcon,
  SearchIconContainer,
} from './styles';
import useUserQuery from '~/core/hooks/useUserQuery';
import ConditionalRender from '~/core/components/ConditionalRender';

const SocialSearch = ({ className, sticky = false, searchBy }) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const [value, setValue] = useState('');
  const [users = [], hasMoreUsers, loadMoreUsers] = useUserQuery(value);
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList({
    search: value,
  });
  const handleChange = newVal => {
    setValue(newVal);
  };

  const getPagination = activeTab => {
    const hasMore = activeTab === 'communities' ? hasMoreCommunities : hasMoreUsers;
    const loadMore = activeTab === 'communities' ? loadMoreCommunities : loadMoreUsers;

    return hasMore ? loadMore : undefined;
  };

  const handlePick = (name, activeTab) => {
    if (activeTab === 'communities') {
      const { communityId } = communities.find(item => item.displayName === name) ?? {};
      communityId && onClickCommunity(communityId);
    } else if (activeTab === 'accounts') {
      const { userId } = users.find(item => item.displayName === name) ?? {};
      userId && onClickUser(userId);
    }
  };

  const communityRenderer = communityName => {
    const { communityId } = communities.find(item => item.displayName === communityName) ?? {};
    return (
      <ConditionalRender condition={!!communityId}>
        <CommunityHeader communityId={communityId} />
      </ConditionalRender>
    );
  };

  const userRenderer = userName => {
    const { userId } = users.find(item => item.displayName === userName) ?? {};
    return (
      <ConditionalRender condition={!!userId}>
        <UserHeader userId={userId} />
      </ConditionalRender>
    );
  };

  const rendererMap = useMemo(
    () => ({
      communities: communityRenderer,
      accounts: userRenderer,
    }),
    [value, users, communities],
  );

  const allItems = useMemo(
    () => ({
      communities: communities.map(community => community.displayName),
      accounts: users.map(community => community.displayName),
    }),
    [value, communities, users],
  );

  const items = useMemo(() => {
    return Object.keys(allItems).reduce((acc, key) => {
      if (searchBy.includes(key)) {
        acc[key] = allItems[key];
      }

      return acc;
    }, {});
  }, [allItems]);

  return (
    <SocialSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <SocialSearchInput
            value={value}
            setValue={setValue}
            items={items}
            filter={null}
            onChange={handleChange}
            onPick={handlePick}
            className={className}
            getPagination={getPagination}
            placeholder={placeholder}
            prepend={
              <SearchIconContainer>
                <SearchIcon />
              </SearchIconContainer>
            }
          >
            {(displayName, inputValue, activeTab) => rendererMap[activeTab](displayName)}
          </SocialSearchInput>
        )}
      </FormattedMessage>
    </SocialSearchContainer>
  );
};

SocialSearch.propTypes = {
  className: PropTypes.string,
  sticky: PropTypes.bool,
  searchBy: PropTypes.arrayOf(PropTypes.string),
};

SocialSearch.defaultProps = {
  sticky: false,
  searchBy: ['communities', 'accounts'],
};

export default customizableComponent('SocialSearch', SocialSearch);
