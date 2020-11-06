import React from 'react';
import PropTypes from 'prop-types';
import useCommunity from '~/social/hooks/useCommunity';
import UITrendingItem from './UITrendingItem';

const TrendingItem = ({ communityId, slim, onClick }) => {
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
      slim={slim}
      onClick={handleClick}
    />
  );
};

TrendingItem.propTypes = {
  communityId: PropTypes.string.isRequired,
  slim: PropTypes.bool,
  onClick: PropTypes.func,
};

TrendingItem.defaultProps = {
  slim: false,
  onClick: () => {},
};

export { UITrendingItem };
export default TrendingItem;
