import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';
import PostCompose from '~/social/components/PostCompose';
import Post from '~/social/components/Post';
import { customizableComponent } from '~/core/hocs/customization';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import EmptyFeed from '~/social/components/EmptyFeed';
import useFeedSdk from './useFeedSdk';
import { FeedScrollContainer } from './styles';

const Feed = ({
  targetType = EkoPostTargetType.MyFeed,
  targetId = '',
  showPostCompose = false,
  feedClassName = null,
  onCreatePostSuccess = null,
  blockRouteChange,
  emptyFeedIcon,
  goToExplore,
}) => {
  const [posts, hasMore, loadMore] = useFeedSdk({ targetType, targetId });

  return (
    <FeedScrollContainer
      className={feedClassName}
      loadMore={loadMore}
      hasMore={hasMore}
      loader={<div key={0}>Loading...</div>}
    >
      <ConditionalRender condition={showPostCompose}>
        <PostCompose
          targetType={targetType}
          targetId={targetId}
          onCreateSuccess={onCreatePostSuccess}
          blockRouteChange={blockRouteChange}
        />
      </ConditionalRender>
      <ConditionalRender condition={posts.length}>
        {posts.map(({ postId }) => (
          <Post key={postId} postId={postId} />
        ))}
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
  showPostCompose: PropTypes.bool,
  feedClassName: PropTypes.string,
  onCreatePostSuccess: PropTypes.func,
  blockRouteChange: PropTypes.func,
  emptyFeedIcon: PropTypes.object,
  goToExplore: PropTypes.func,
};

export default customizableComponent('Feed', Feed);
