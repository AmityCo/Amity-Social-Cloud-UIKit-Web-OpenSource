import React, { memo } from 'react';
import PropTypes from 'prop-types';
import useCommunity from '~/social/hooks/useCommunity';
import useImage from '~/core/hooks/useImage';
import UITrendingItem from './UINewsFeedTrendingItem';

const NewsFeedTrendingItem = ({ communityId, onClick, loading }) => {
  const { community, file, communityCategories } = useCommunity(communityId);
  const { fileId } = file;
  const fileUrl = useImage({ fileId });

  const { membersCount, description } = community;

  const handleClick = () => onClick(communityId);

  return (
    <UITrendingItem
      avatarFileUrl={fileUrl}
      description={description}
      categories={communityCategories}
      membersCount={membersCount}
      isOfficial={community.isOfficial}
      isPublic={community.isPublic}
      name={community.displayName}
      loading={loading}
      onClick={handleClick}
    />
  );
};

NewsFeedTrendingItem.propTypes = {
  communityId: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
};

NewsFeedTrendingItem.defaultProps = {
  onClick: () => {},
  loading: false,
};

export { UITrendingItem };
export default memo(NewsFeedTrendingItem);
