import React, { useMemo } from 'react';
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
}) => {
  const { community, communityCategories, file } = useCommunity(communityId);

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = useMemo(
    () =>
      community.avatarFileId &&
      FileRepository.getFileUrlById({
        fileId: community.avatarFileId,
        imageSize: ImageSize.Medium,
      }),
    [community.avatarFileId],
  );

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
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
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
