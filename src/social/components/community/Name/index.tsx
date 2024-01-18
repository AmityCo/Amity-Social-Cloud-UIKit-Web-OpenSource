import React from 'react';

import Truncate from 'react-truncate-markup';
import Highlight from '~/core/components/Highlight';
import Skeleton from '~/core/components/Skeleton';

import {
  Name,
  NameContainer,
  PrivateIcon,
  VerifiedIcon,
} from '~/social/components/community/Name/styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export interface CommunityNameProps {
  'data-qa-anchor'?: string;
  isActive?: boolean;
  isOfficial?: boolean;
  isPublic?: boolean;
  isTitle?: boolean;
  isSearchResult?: boolean;
  name?: string;
  searchInput?: string;
  className?: string;
  loading?: boolean;
  truncate?: number;
}

const CommunityName = ({
  'data-qa-anchor': dataQaAnchor = '',
  isActive = false,
  isOfficial = false,
  isPublic = false,
  isTitle = false,
  isSearchResult = false,
  name,
  searchInput = '',
  className = '',
  loading = false,
  truncate,
}: CommunityNameProps) => {
  if (isSearchResult) {
    return <Highlight text={name || ''} query={searchInput} />;
  }

  return (
    <NameContainer className={className} isActive={isActive} isTitle={isTitle}>
      {loading ? (
        <Name>
          <Skeleton width={120} style={{ fontSize: 12 }} />
        </Name>
      ) : (
        <Truncate lines={truncate}>
          <Name data-qa-anchor={`${dataQaAnchor}-community-name`} title={name}>
            <>
              {!isPublic && <PrivateIcon data-qa-anchor={`${dataQaAnchor}-private-icon`} />}
              {name}
            </>
          </Name>
        </Truncate>
      )}

      {!loading && isOfficial && <VerifiedIcon />}
    </NameContainer>
  );
};

export default (props: CommunityNameProps) => {
  const CustomComponentFn = useCustomComponent<CommunityNameProps>('CommunityName');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityName {...props} />;
};
