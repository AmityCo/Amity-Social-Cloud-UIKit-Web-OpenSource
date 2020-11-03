import React from 'react';
import PropTypes from 'prop-types';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityHeader from './styles';

const CommunityHeader = ({ communityId, onClick, isActive, isSearchResult, searchInput }) => {
  const { file } = useCommunity(communityId);
  const { fileUrl } = file;

  return (
    <UICommunityHeader
      communityId={communityId}
      avatarFileUrl={fileUrl}
      isActive={isActive}
      onClick={onClick}
      isSearchResult={isSearchResult}
      searchInput={searchInput}
    />
  );
};

CommunityHeader.propTypes = {
  communityId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
};

CommunityHeader.defaultProps = {
  onClick: () => {},
  isActive: false,
  isSearchResult: false,
  searchInput: '',
};

export { UICommunityHeader };
export default CommunityHeader;
