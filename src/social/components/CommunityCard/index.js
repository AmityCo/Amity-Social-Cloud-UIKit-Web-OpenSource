import React from 'react';
import PropTypes from 'prop-types';

import useCommunity from '~/social/hooks/useCommunity';

import UICommunityCard from './styles';

const CommunityCard = ({ communityId, onClick }) => {
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
    />
  );
};

CommunityCard.propTypes = {
  communityId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CommunityCard;
