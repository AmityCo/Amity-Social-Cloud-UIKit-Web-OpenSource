import React from 'react';
import { PostTargetType } from '@amityco/js-sdk';
import useImage from '~/core/hooks/useImage';
import { MenuItem } from '~/core/components/Menu';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { Avatar } from './styles';

const CommunityItem = ({
  'data-qa-anchor': dataQaAnchor = '',
  community,
  currentTargetId,
  onChange,
  onClose,
}) => {
  const avatarFileUrl = useImage({ fileId: community.avatarFileId });

  return (
    <MenuItem
      data-qa-anchor={dataQaAnchor}
      active={community.communityId === currentTargetId}
      onClick={() => {
        onChange({
          targetId: community.communityId,
          targetType: PostTargetType.CommunityFeed,
        });
        onClose();
      }}
    >
      <Avatar avatar={avatarFileUrl} size="tiny" backgroundImage={CommunityImage} />
      {` ${community.displayName}`}
    </MenuItem>
  );
};

export default CommunityItem;
