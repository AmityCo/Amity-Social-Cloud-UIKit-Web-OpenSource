import React from 'react';
import PropTypes from 'prop-types';
import CommunitiesList from '~/social/components/CommunitiesList';

const CommunitiesSearchList = ({ searchInput, onClickSearchResult }) => {
  const searchParameter = { search: searchInput };

  if (!searchInput) return null;

  return (
    <CommunitiesList
      communitiesQueryParam={searchParameter}
      onClickCommunity={onClickSearchResult}
    />
  );
};

CommunitiesSearchList.propTypes = {
  searchInput: PropTypes.string,
  onClickSearchResult: PropTypes.func,
};

export default CommunitiesSearchList;
