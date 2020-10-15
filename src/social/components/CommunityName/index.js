import React from 'react';
import PropTypes from 'prop-types';

import Highlight from '~/core/components/Highlight';
import useCommunity from '~/social/hooks/useCommunity';
import UICommunityName from './UICommunityName';

const CommunityName = ({ communityId, isActive, isSearchResult, searchInput }) => {
  const community = useCommunity(communityId);
  const { displayName, isOfficial, isPublic } = community;
  if (isSearchResult) {
    return <Highlight text={displayName || ''} query={searchInput} />;
  }
  return (
    <UICommunityName
      name={displayName}
      isPublic={isPublic}
      isOfficial={isOfficial}
      isActive={isActive}
    />
  );
};

CommunityName.propTypes = {
  communityId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
};

CommunityName.defaultProps = {
  isActive: false,
  isSearchResult: false,
  searchInput: '',
};

export { UICommunityName };
export default CommunityName;
