import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useCommunity from '~/social/hooks/useCommunity';
import UITrendingItem from './UITrendingItem';

const TrendingItem = ({ communityId, slim, onClick, loading }) => {
  const { community, file, communityCategories } = useCommunity(communityId);
  const { fileUrl } = file;

  const { membersCount, description } = community;

  const handleClick = () => onClick(communityId);

  return (
    <UITrendingItem
      avatarFileUrl={fileUrl}
      description={description}
      categories={communityCategories}
      membersCount={membersCount}
      slim={slim}
      onClick={handleClick}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      name={community.displayName}
      loading={loading}
    />
  );
};

TrendingItem.propTypes = {
  communityId: PropTypes.string,
  slim: PropTypes.bool,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

TrendingItem.defaultProps = {
  slim: false,
  onClick: () => {},
  loading: false,
};

export { UITrendingItem };
export default memo(TrendingItem);
