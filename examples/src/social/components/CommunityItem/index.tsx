import React from 'react';

import CommunityName from '~/social/components/community/Name';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import { Avatar, CommunityItemContainer } from './styles';
import useFile from '~/core/hooks/useFile';

interface CommunityItemProps {
  community: Amity.Community;
  active?: boolean;
  onClick?: () => void;
}

const CommunityItem = ({ community, active, onClick }: CommunityItemProps) => {
  const avatar = useFile(community.avatarFileId);
  return (
    <CommunityItemContainer active={active} onClick={onClick}>
      <Avatar avatar={avatar?.fileUrl} backgroundImage={CommunityImage} />
      <CommunityName
        isOfficial={community.isOfficial}
        isPublic={community.isPublic}
        name={community.displayName}
      />
    </CommunityItemContainer>
  );
};

export default CommunityItem;
