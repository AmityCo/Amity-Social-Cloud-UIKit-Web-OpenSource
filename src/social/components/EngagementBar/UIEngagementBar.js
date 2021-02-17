import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import { EkoCommentReferenceType } from 'eko-sdk';

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

const COMMENTS_PER_PAGE = 5;

const UIEngagementBar = ({
  postId,
  totalLikes,
  totalComments,
  noInteractionMessage,
  onClickComment,
  isComposeBarDisplayed,
  handleAddComment,
}) => (
  <EngagementBarContainer>
    <Counters>
      <ConditionalRender condition={totalLikes > 0}>
        <span>
          {toHumanString(totalLikes)}{' '}
          <FormattedMessage id="plural.like" values={{ amount: totalLikes }} />
        </span>
      </ConditionalRender>
      <ConditionalRender condition={totalComments > 0}>
        <span>
          {toHumanString(totalComments)}{' '}
          <FormattedMessage id="plural.comment" values={{ amount: totalComments }} />
        </span>
      </ConditionalRender>
    </Counters>
    <ConditionalRender condition={!!noInteractionMessage}>
      <>
        <CommentList
          referenceId={postId}
          referenceType={EkoCommentReferenceType.Post}
          last={COMMENTS_PER_PAGE}
          canInteract={false}
          loadMoreText={<FormattedMessage id="collapsible.viewAllComments" />}
        />
        {noInteractionMessage && (
          <NoInteractionMessage>{noInteractionMessage}</NoInteractionMessage>
        )}
      </>
      <>
        <InteractionBar>
          <PostLikeButton postId={postId} />
          <SecondaryButton onClick={onClickComment}>
            <CommentIcon /> Comment
          </SecondaryButton>
        </InteractionBar>
        <CommentList
          referenceId={postId}
          referenceType={EkoCommentReferenceType.Post}
          last={COMMENTS_PER_PAGE}
          loadMoreText={<FormattedMessage id="collapsible.viewAllComments" />}
        />
        <ConditionalRender condition={isComposeBarDisplayed}>
          <CommentComposeBar onSubmit={handleAddComment} />
        </ConditionalRender>
      </>
    </ConditionalRender>
  </EngagementBarContainer>
);

UIEngagementBar.propTypes = {
  postId: PropTypes.string,
  totalLikes: PropTypes.number,
  totalComments: PropTypes.number,
  noInteractionMessage: PropTypes.string,
  onClickComment: PropTypes.func,
  isComposeBarDisplayed: PropTypes.bool,
  handleAddComment: PropTypes.func,
};

UIEngagementBar.defaultProps = {
  postId: '',
  totalLikes: 0,
  totalComments: 0,
  noInteractionMessage: null,
  onClickComment: () => {},
  isComposeBarDisplayed: false,
  handleAddComment: () => {},
};

export default customizableComponent('UIEngagementBar', UIEngagementBar);
