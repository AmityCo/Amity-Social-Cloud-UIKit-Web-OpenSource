import React from 'react';
import PropTypes from 'prop-types';

import Highlight from '~/core/components/Highlight';
import useCommunity from '~/social/hooks/useCommunity';
import UICommunityName from './UICommunityName';

const CommunityName = ({
  communityId,
  isActive,
  isTitle,
  isSearchResult,
  searchInput,
  className,
}) => {
  const { community } = useCommunity(communityId);
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
      isTitle={isTitle}
      className={className}
    />
  );
};

CommunityName.propTypes = {
  communityId: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  isTitle: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
  className: PropTypes.string,
};

CommunityName.defaultProps = {
  isActive: false,
  isTitle: false,
  isSearchResult: false,
  searchInput: '',
  className: null,
};

export { UICommunityName };
export default CommunityName;
