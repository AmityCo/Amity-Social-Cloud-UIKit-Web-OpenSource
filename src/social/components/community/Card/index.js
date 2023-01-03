import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useImage from '~/core/hooks/useImage';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityCard from './UICommunityCard';

const CommunityCard = ({ communityId, onClick, ...props }) => {
  const { community, file, communityCategories, joinCommunity } = useCommunity(communityId);
  const { fileId } = file;
  const fileUrl = useImage({ fileId });

  const { membersCount, description, isJoined } = community;

  return (
    <UICommunityCard
      avatarFileUrl={fileUrl}
      communityId={communityId}
      communityCategories={communityCategories}
      membersCount={membersCount}
      description={description}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      name={community.displayName}
      onClick={onClick}
      onClickJoin={joinCommunity}
      isJoining={false}
      isJoined={isJoined}
      {...props}
    />
  );
};

CommunityCard.propTypes = {
  communityId: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

export default memo(CommunityCard);
