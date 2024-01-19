import React, { memo } from 'react';
import useImage from '~/core/hooks/useImage';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityCard from './UICommunityCard';
import useFile from '~/core/hooks/useFile';
import useCategoriesByIds from '~/social/hooks/useCategoriesByIds';

export { UICommunityCard };

interface CommunityCardProps {
  communityId: string;
  loading?: boolean;
  onClick?: (communityId: string) => void;
}

const CommunityCard = ({ communityId, onClick, ...props }: CommunityCardProps) => {
  const community = useCommunity(communityId);
  const file = useFile(community?.avatarFileId);
  const communityCategories = useCategoriesByIds(community?.categoryIds || []);
  const fileUrl = useImage({ fileId: file?.fileId ?? undefined });

  if (community == null) return <></>;

  const { membersCount, description } = community;

  return (
    <UICommunityCard
      avatarFileUrl={fileUrl}
      community={community}
      communityCategories={communityCategories}
      membersCount={membersCount}
      description={description}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      name={community.displayName}
      onClick={onClick}
      {...props}
    />
  );
};

export default memo(CommunityCard);
