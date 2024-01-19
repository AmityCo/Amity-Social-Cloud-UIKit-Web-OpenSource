import React, { memo, useMemo } from 'react';

import { FileRepository } from '@amityco/ts-sdk';
import useCommunity from '~/social/hooks/useCommunity';

import UICommunityHeader from './UICommunityHeader';
import useFile from '~/core/hooks/useFile';
import useImage from '~/core/hooks/useImage';

interface CommunityHeaderProps {
  communityId?: string;
  onClick?: () => void;
  isActive?: boolean;
  isSearchResult?: boolean;
  searchInput?: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const CommunityHeader = ({
  communityId = '',
  onClick = () => {},
  isActive = false,
  isSearchResult = false,
  searchInput = '',
  children,
  loading = false,
}: CommunityHeaderProps) => {
  const community = useCommunity(communityId);

  const avatarFileUrl = useImage({ fileId: community?.avatarFileId, imageSize: 'small' });

  return (
    <UICommunityHeader
      communityId={communityId}
      avatarFileUrl={avatarFileUrl}
      isActive={isActive}
      isOfficial={community?.isOfficial}
      isPublic={community?.isPublic}
      isSearchResult={isSearchResult}
      name={community?.displayName}
      searchInput={searchInput}
      loading={loading}
      onClick={onClick}
    >
      {children}
    </UICommunityHeader>
  );
};

export { UICommunityHeader };
export default memo(CommunityHeader);
