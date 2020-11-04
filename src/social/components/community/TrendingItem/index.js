import React from 'react';
import PropTypes from 'prop-types';
import useCommunity from '~/social/hooks/useCommunity';
import UITrendingItem from './UITrendingItem';

const TrendingItem = ({ communityId, onClick }) => {
  const { community, file, communityCategories } = useCommunity(communityId);
  const { fileUrl } = file;

  const { membersCount, description } = community;

  const handleClick = () => onClick(communityId);

  return (
    <UITrendingItem
      communityId={communityId}
      avatarFileUrl={fileUrl}
      description={description}
      categories={communityCategories}
      membersCount={membersCount}
      onClick={handleClick}
    />
  );
};

TrendingItem.propTypes = {
  communityId: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

TrendingItem.defaultProps = {
  onClick: () => {},
};

export { UITrendingItem };
export default TrendingItem;
