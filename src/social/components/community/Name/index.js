import React from 'react';
import PropTypes from 'prop-types';

import Highlight from '~/core/components/Highlight';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import {
  Name,
  NameContainer,
  PrivateIcon,
  VerifiedIcon,
} from '~/social/components/community/Name/styles';

const CommunityName = ({
  isActive,
  isOfficial,
  isPublic,
  isTitle,
  isSearchResult,
  name,
  searchInput,
  className,
  loading,
  truncate,
}) => {
  if (isSearchResult) {
    return <Highlight text={name || ''} query={searchInput} />;
  }

  return (
    <NameContainer className={className} isActive={isActive} isTitle={isTitle}>
      <Name title={name}>
        {!loading && !isPublic && <PrivateIcon />}{' '}
        {loading ? <Skeleton width={120} style={{ fontSize: 12 }} /> : name}
      </Name>
      {!loading && isOfficial && <VerifiedIcon />}
    </NameContainer>
  );
};

CommunityName.propTypes = {
  isActive: PropTypes.bool,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  isTitle: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  name: PropTypes.string,
  searchInput: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  truncate: PropTypes.number,
};

CommunityName.defaultProps = {
  isActive: false,
  isOfficial: false,
  isPublic: false,
  isTitle: false,
  isSearchResult: false,
  name: '',
  searchInput: '',
  className: null,
  loading: false,
  truncate: 1,
};

export default customizableComponent('CommunityName', CommunityName);
