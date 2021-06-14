import React, { memo } from 'react';
import PropTypes from 'prop-types';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityCard from './styles';

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
      onClick={onClick}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      name={community.displayName}
      {...props}
    />
  );
};

CommunityCard.propTypes = {
  communityId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default memo(CommunityCard);
