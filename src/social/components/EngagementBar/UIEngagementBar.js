import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CommentReferenceType } from '@amityco/js-sdk';
import { LazyRender } from '@noom/wax-component-library';

import { toHumanString } from '~/helpers/toHumanString';
import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
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

const COMMENTS_PER_PAGE = 3;
const COMMENT_PLACEHOLDER_HEIGHT = 135;

const UIEngagementBar = ({
  postId,
  targetType,
  totalLikes,
  totalComments,
  readonly,
  onClickComment,
  isComposeBarDisplayed,
  handleAddComment,
  handleCopyCommentPath,
}) => (
  <EngagementBarContainer>
    <Counters>
      {totalLikes > 0 && (
        <span>
          {toHumanString(totalLikes)}{' '}
          <FormattedMessage id="plural.like" values={{ amount: totalLikes }} />
        </span>
      )}

      {totalComments > 0 && (
        <span>
          {toHumanString(totalComments)}{' '}
          <FormattedMessage id="plural.comment" values={{ amount: totalComments }} />
        </span>
      )}
    </Counters>
    <ConditionalRender condition={!readonly}>
      <>
        <InteractionBar>
          <PostLikeButton postId={postId} />
          <SecondaryButton data-qa-anchor="social-comment-post" onClick={onClickComment}>
            <CommentIcon /> <FormattedMessage id="comment" />
          </SecondaryButton>
        </InteractionBar>
        <LazyRender
          idleTimeout={0}
          lazyBehavior="keepMounted"
          visibleOffset={500}
          placeholderHeight={
            Math.min(totalComments, COMMENTS_PER_PAGE) * COMMENT_PLACEHOLDER_HEIGHT
          }
        >
          <CommentList
            referenceId={postId}
            referenceType={CommentReferenceType.Post}
            last={COMMENTS_PER_PAGE}
            handleCopyCommentPath={handleCopyCommentPath}
          />
        </LazyRender>
        {isComposeBarDisplayed && (
          <CommentComposeBar
            postId={postId}
            postType={targetType}
            onSubmit={handleAddComment}
            onCancel={onClickComment}
          />
        )}
      </>
      <>
        <NoInteractionMessage>
          <FormattedMessage id="community.cannotInteract" />
        </NoInteractionMessage>

        <CommentList
          referenceId={postId}
          referenceType={CommentReferenceType.Post}
          last={COMMENTS_PER_PAGE}
          readonly
          loadMoreText={<FormattedMessage id="collapsible.viewAllComments" />}
          handleCopyCommentPath={handleCopyCommentPath}
        />
      </>
    </ConditionalRender>
  </EngagementBarContainer>
);

UIEngagementBar.propTypes = {
  postId: PropTypes.string,
  targetType: PropTypes.string,
  totalLikes: PropTypes.number,
  totalComments: PropTypes.number,
  readonly: PropTypes.bool,
  isComposeBarDisplayed: PropTypes.bool,
  handleAddComment: PropTypes.func,
  onClickComment: PropTypes.func,
  handleCopyCommentPath: PropTypes.func,
};

UIEngagementBar.defaultProps = {
  postId: '',
  targetType: '',
  totalLikes: 0,
  totalComments: 0,
  readonly: false,
  onClickComment: () => {},
  isComposeBarDisplayed: false,
  handleAddComment: () => {},
};

export default customizableComponent('UIEngagementBar', UIEngagementBar);
