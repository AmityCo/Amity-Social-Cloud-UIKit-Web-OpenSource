import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

import { ImageSize, FileRepository } from '@amityco/js-sdk';
import useCommunity from '~/social/hooks/useCommunity';

import UICommunityHeader from './styles';

const CommunityHeader = ({
  communityId,
  onClick,
  isActive,
  isSearchResult,
  searchInput,
  children,
  loading,
}) => {
  const { community, communityCategories, file } = useCommunity(communityId);

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: ImageSize.Small,
      }),
    [community.avatarFileId],
  );

  const [render] = [].concat(children);

  return (
    <UICommunityHeader
      communityId={communityId}
      avatarFileUrl={fileUrl}
      isActive={isActive}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      isSearchResult={isSearchResult}
      name={community.displayName}
      searchInput={searchInput}
      loading={loading}
      onClick={onClick}
    >
      {typeof render === 'function' ? render({ community, communityCategories, file }) : children}
    </UICommunityHeader>
  );
};

CommunityHeader.propTypes = {
  communityId: PropTypes.string,
  isActive: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

CommunityHeader.defaultProps = {
  onClick: () => {},
  isActive: false,
  isSearchResult: false,
  searchInput: '',
  children: null,
  loading: false,
};

export { UICommunityHeader };
export default memo(CommunityHeader);
