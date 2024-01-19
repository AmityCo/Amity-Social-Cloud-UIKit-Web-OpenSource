import React from 'react';

import useImage from '~/core/hooks/useImage';
import { MenuItem } from '~/core/components/Menu';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { Avatar } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface CommunityItemProps {
  'data-qa-anchor'?: string;
  community: Amity.Community;
  currentTargetId?: string | null;
  onChange: (data: { targetId: string; targetType: string }) => void;
  onClose: () => void;
}

const CommunityItem = ({
  'data-qa-anchor': dataQaAnchor = '',
  community,
  currentTargetId,
  onChange,
  onClose,
}: CommunityItemProps) => {
  const avatarFileUrl = useImage({ fileId: community.avatarFileId, imageSize: 'small' });

  return (
    <MenuItem
      data-qa-anchor={dataQaAnchor}
      active={community.communityId === currentTargetId}
      onClick={() => {
        onChange({
          targetId: community.communityId,
          targetType: 'communityFeed',
        });
        onClose();
      }}
    >
      <Avatar avatar={avatarFileUrl} size="tiny" backgroundImage={CommunityImage} />
      {` ${community.displayName}`}
    </MenuItem>
  );
};

export default (props: CommunityItemProps) => {
  const CustomComponentFn = useCustomComponent<CommunityItemProps>('CommunityItem');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <CommunityItem {...props} />;
};
