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

const communityRenderer = (communities) => (communityName) => {
  const { communityId } = communities.find((item) => item.displayName === communityName) ?? {};

  return !!communityId && <CommunityHeader communityId={communityId} />;
};

const userRenderer = (users) => (userName) => {
  const { userId, isGlobalBan } = users.find((item) => item.displayName === userName) ?? {};

  return !!userId && <UserHeader userId={userId} isBanned={isGlobalBan} />;
};

const SocialSearch = ({ className, sticky = false, searchBy }) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const [value, setValue] = useState('');
  const [users = [], hasMoreUsers, loadMoreUsers] = useUserQuery(value);
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList({
    search: value,
  });
  const handleChange = (newVal) => {
    setValue(newVal);
  };

  const getPagination = (activeTab) => {
    const hasMore = activeTab === 'communities' ? hasMoreCommunities : hasMoreUsers;
    const loadMore = activeTab === 'communities' ? loadMoreCommunities : loadMoreUsers;

    return hasMore ? loadMore : undefined;
  };

  const handlePick = (name, activeTab) => {
    if (activeTab === 'communities') {
      const { communityId } = communities.find((item) => item.displayName === name) ?? {};
      communityId && onClickCommunity(communityId);
    } else if (activeTab === 'accounts') {
      const { userId } = users.find((item) => item.displayName === name) ?? {};
      userId && onClickUser(userId);
    }
  };

  const rendererMap = useMemo(
    () => ({
      communities: communityRenderer(communities),
      accounts: userRenderer(users),
    }),
    [communities, users],
  );

  const allItems = useMemo(
    () => ({
      communities: communities.map((community) => community.displayName),
      accounts: users.map((community) => community.displayName),
    }),
    [communities, users],
  );

  const items = useMemo(() => {
    return Object.keys(allItems).reduce((acc, key) => {
      if (searchBy.includes(key)) {
        acc[key] = allItems[key];
      }

      return acc;
    }, {});
  }, [allItems, searchBy]);

  return (
    <SocialSearchContainer className={className} sticky={sticky}>
      <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
        {([placeholder]) => (
          <SocialSearchInput
            value={value}
            setValue={setValue}
            items={items}
            filter={null}
            className={className}
            getPagination={getPagination}
            placeholder={placeholder}
            prepend={
              <SearchIconContainer>
                <SearchIcon />
              </SearchIconContainer>
            }
            onChange={handleChange}
            onPick={handlePick}
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
