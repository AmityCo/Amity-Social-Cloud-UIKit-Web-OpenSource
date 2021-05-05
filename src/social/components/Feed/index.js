import React from 'react';
import PropTypes from 'prop-types';
import { PostTargetType, CommunityFilter } from '@amityco/js-sdk';

import useCommunitiesList from '~/social/hooks/useCommunitiesList';
import PostCreator from '~/social/components/post/Creator';
import Post from '~/social/components/post/Post';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import EmptyFeed from '~/social/components/EmptyFeed';
import LoadMore from '~/social/components/LoadMore';
import useFeed from '~/social/hooks/useFeed';
import { FeedScrollContainer } from './styles';

const queryParams = { filter: CommunityFilter.Member };

const Feed = ({
  className = null,
  targetType = PostTargetType.MyFeed,
  targetId = '',
  showPostCreator = false,
  onPostCreated,
  goToExplore,
  readonly = false,
}) => {
  const [posts, hasMore, loadMore] = useFeed({ targetType, targetId });
  const [communities, hasMoreCommunities, loadMoreCommunities] = useCommunitiesList(queryParams);

  const enablePostTargetPicker = targetType === PostTargetType.GlobalFeed;

  return (
    <FeedScrollContainer
      className={className}
      dataLength={posts.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <ConditionalRender condition={showPostCreator}>
        <PostCreator
          targetType={targetType}
          targetId={targetId}
          onCreateSuccess={onPostCreated}
          communities={communities}
          enablePostTargetPicker={enablePostTargetPicker}
          hasMoreCommunities={hasMoreCommunities}
          loadMoreCommunities={loadMoreCommunities}
        />
      </ConditionalRender>
      <ConditionalRender condition={posts.length}>
        <LoadMore hasMore={hasMore} loadMore={loadMore} className="load-more no-border">
          {posts.map(({ postId }) => (
            <Post
              key={postId}
              postId={postId}
              hidePostTarget={targetType !== PostTargetType.GlobalFeed}
              readonly={readonly}
            />
          ))}
        </LoadMore>
        <EmptyFeed targetType={targetType} goToExplore={goToExplore} />
      </ConditionalRender>
    </FeedScrollContainer>
  );
};

Feed.propTypes = {
  className: PropTypes.string,
  targetType: PropTypes.oneOf(Object.values(PostTargetType)),
  targetId: PropTypes.string,
  showPostCreator: PropTypes.bool,
  onPostCreated: PropTypes.func,
  // below is to be refactored
  goToExplore: PropTypes.func,
  readonly: PropTypes.bool,
};

export default customizableComponent('Feed', Feed);
