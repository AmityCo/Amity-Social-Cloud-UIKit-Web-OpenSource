import React from 'react';
import PropTypes from 'prop-types';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityHeader from './styles';

const CommunityHeader = ({
  communityId,
  onClick,
  isActive,
  isSearchResult,
  searchInput,
  children,
}) => {
  const { community, communityCategories, file } = useCommunity(communityId);
  const { fileUrl } = file;

  const [render] = [].concat(children);

  return (
    <UICommunityHeader
      communityId={communityId}
      avatarFileUrl={fileUrl}
      isActive={isActive}
      onClick={onClick}
      isSearchResult={isSearchResult}
      searchInput={searchInput}
    >
      {typeof render === 'function' ? render({ community, communityCategories, file }) : children}
    </UICommunityHeader>
  );
};

CommunityHeader.propTypes = {
  communityId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
  children: PropTypes.oneOf([PropTypes.func, PropTypes.node]),
};

CommunityHeader.defaultProps = {
  onClick: () => {},
  isActive: false,
  isSearchResult: false,
  searchInput: '',
  children: null,
};

export { UICommunityHeader };
export default CommunityHeader;
