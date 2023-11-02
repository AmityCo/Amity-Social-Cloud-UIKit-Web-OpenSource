import React from 'react';
import PropTypes from 'prop-types';

import Truncate from 'react-truncate-markup';
import Highlight from '~/core/components/Highlight';
import Skeleton from '~/core/components/Skeleton';
import customizableComponent from '~/core/hocs/customization';
import {
  Name,
  NameContainer,
  PrivateIcon,
  VerifiedIcon,
  DescriptionForAll,
} from '~/social/components/community/Name/styles';

const CommunityName = ({
  'data-qa-anchor': dataQaAnchor = '',
  isActive,
  isOfficial,
  isPublic,
  isTitle,
  isSearchResult,
  name,
  description,
  searchInput,
  className,
  loading,
  truncate,
}) => {
  if (isSearchResult) {
    return <Highlight text={name || ''} query={searchInput} />;
  }

  return (
    <div>
      <NameContainer className={className} isActive={isActive} isTitle={isTitle}>
        {loading ? (
          <Name>
            <Skeleton width={120} style={{ fontSize: 12 }} />
          </Name>
        ) : (
          <Truncate lines={truncate}>
            <Name data-qa-anchor={`${dataQaAnchor}-community-name`} title={name}>
              {!isPublic && <PrivateIcon data-qa-anchor={`${dataQaAnchor}-private-icon`} />}
              {name}
            </Name>
          </Truncate>
        )}
        {!loading && isOfficial && <VerifiedIcon />}
      </NameContainer>
      {description && (
        <Truncate lines={3}>
          <DescriptionForAll>{description}</DescriptionForAll>
        </Truncate>
      )}
    </div>
  );
};

CommunityName.propTypes = {
  'data-qa-anchor': PropTypes.string,
  isActive: PropTypes.bool,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  isTitle: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  name: PropTypes.string,
  description: PropTypes.string,
  searchInput: PropTypes.string,
  className: PropTypes.string,
  loading: PropTypes.bool,
  truncate: PropTypes.number,
};

CommunityName.defaultProps = {
  'data-qa-anchor': '',
  isActive: false,
  isOfficial: false,
  isPublic: false,
  isTitle: false,
  isSearchResult: false,
  name: '',
  description: '',
  searchInput: '',
  className: null,
  loading: false,
  truncate: 1,
};

export default customizableComponent('CommunityName', CommunityName);
