import React, { memo } from 'react';
import PropTypes from 'prop-types';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityCard from './UICommunityCard';

const CommunityCard = ({ communityId, onClick, ...props }) => {
  const { community, file, communityCategories } = useCommunity(communityId);
  const { fileUrl } = file;

  const { membersCount, description } = community;

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
