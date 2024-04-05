import React from 'react';
import millify from 'millify';
import { FormattedMessage } from 'react-intl';

import PostLikeButton from '~/social/components/post/LikeButton';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import { SecondaryButton } from '~/core/components/Button';
import {
  EngagementBarContainer,
  Counters,
  InteractionBar,
  CommentIcon,
  NoInteractionMessage,
} from './styles';
import CommentList from '~/social/components/CommentList';
import { LIKE_REACTION_KEY } from '~/constants';
import { Mentionees, Metadata } from '~/helpers/utils';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import usePostSubscription from '~/social/hooks/usePostSubscription';
import { SubscriptionLevels } from '@amityco/ts-sdk';

const COMMENTS_PER_PAGE = 5;

interface UIEngagementBarProps {
  post: Amity.Post;
  readonly?: boolean;
  onClickComment?: () => void;
  isComposeBarDisplayed?: boolean;
  handleAddComment?: (text: string, mentionees: Mentionees, metadata: Metadata) => void;
}

const UIEngagementBar = ({
  post,
  readonly,
  onClickComment,
  isComposeBarDisplayed,
  handleAddComment,
}: UIEngagementBarProps) => {
  const { postId, targetType, targetId, reactions = {}, commentsCount, latestComments } = post;

  usePostSubscription({
    postId,
    level: SubscriptionLevels.POST,
  });

  const totalLikes = reactions[LIKE_REACTION_KEY] || 0;

  return (
    <EngagementBarContainer>
      <Counters>
        {totalLikes > 0 && (
          <span data-qa-anchor="engagement-bar-like-counter">
            {millify(totalLikes || 0)}{' '}
            <FormattedMessage id="plural.like" values={{ amount: totalLikes }} />
          </span>
        )}

        {commentsCount > 0 && (
          <span data-qa-anchor="engagement-bar-comment-counter">
            {millify(commentsCount || 0)}{' '}
            <FormattedMessage id="plural.comment" values={{ amount: commentsCount }} />
          </span>
        )}
      </Counters>
      {!readonly ? (
        <>
          <InteractionBar>
            <PostLikeButton postId={postId} />
            <SecondaryButton
              data-qa-anchor="engagement-bar-comment-button"
              onClick={onClickComment}
            >
              <CommentIcon /> <FormattedMessage id="comment" />
            </SecondaryButton>
          </InteractionBar>
          <CommentList referenceId={postId} referenceType={'post'} limit={COMMENTS_PER_PAGE} />

          {isComposeBarDisplayed && (
            <CommentComposeBar
              postId={postId}
              onSubmit={(text, mentionees, metadata) =>
                handleAddComment?.(text, mentionees, metadata)
              }
            />
          )}
        </>
      ) : (
        <>
          <NoInteractionMessage>
            <FormattedMessage id="community.cannotInteract" />
          </NoInteractionMessage>
          <CommentList
            referenceId={postId}
            referenceType={'post'}
            limit={COMMENTS_PER_PAGE}
            latestComments={latestComments}
            readonly
          />
        </>
      )}
    </EngagementBarContainer>
  );
};

export default (props: UIEngagementBarProps) => {
  const CustomComponentFn = useCustomComponent<UIEngagementBarProps>('UIEngagementBar');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <UIEngagementBar {...props} />;
};
