import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType, EkoCommunityFilter } from 'eko-sdk';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PostCreator from '~/social/components/PostCreator';
import Post from '~/social/components/Post';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import EmptyFeed from '~/social/components/EmptyFeed';
import { LoadMore } from '~/social/components/LoadMore';
import useFeed from '~/social/hooks/useFeed';
import { FeedScrollContainer } from './styles';

const queryParams = { filter: EkoCommunityFilter.Member };

const Feed = ({
  targetType = EkoPostTargetType.MyFeed,
  targetId = '',
  showPostCreator = false,
  feedClassName = null,
  onCreatePostSuccess,
  blockRouteChange,
  emptyFeedIcon,
  goToExplore,
  onPostAuthorClick,
  noPostInteractionMessage = null,
}) => {
  const [posts, hasMore, loadMore] = useFeed({ targetType, targetId });
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList(queryParams);

  return (
    <FeedScrollContainer
      className={feedClassName}
      dataLength={posts.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <ConditionalRender condition={showPostCreator}>
        <PostCreator
          targetType={targetType}
          targetId={targetId}
          onCreateSuccess={onCreatePostSuccess}
          blockRouteChange={blockRouteChange}
          communities={communities}
          hasMoreCommunities={hasMoreCommunities}
          loadMoreCommunities={loadMoreCommunities}
        />
      </ConditionalRender>
      <ConditionalRender condition={posts.length}>
        <LoadMore hasMore={hasMore} loadMore={loadMore} className="no-border">
          {posts.map(({ postId }) => (
            <Post
              key={postId}
              postId={postId}
              onPostAuthorClick={onPostAuthorClick}
              noInteractionMessage={noPostInteractionMessage}
            />
          ))}
        </LoadMore>
        <EmptyFeed
          targetType={targetType}
          emptyFeedIcon={emptyFeedIcon}
          goToExplore={goToExplore}
        />
      </ConditionalRender>
    </FeedScrollContainer>
  );
};

Feed.propTypes = {
  targetType: PropTypes.oneOf(Object.values(EkoPostTargetType)),
  targetId: PropTypes.string,
  showPostCreator: PropTypes.bool,
  feedClassName: PropTypes.string,
  onCreatePostSuccess: PropTypes.func,
  blockRouteChange: PropTypes.func,
  emptyFeedIcon: PropTypes.object,
  goToExplore: PropTypes.func,
  onPostAuthorClick: PropTypes.func,
  noPostInteractionMessage: PropTypes.string,
};

export default customizableComponent('Feed', Feed);
