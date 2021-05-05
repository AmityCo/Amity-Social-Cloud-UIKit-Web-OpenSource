import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';
import { FormattedMessage } from 'react-intl';
import { CommentReferenceType } from '@amityco/js-sdk';

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
  readonly,
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
    <ConditionalRender condition={!readonly}>
      <>
        <InteractionBar>
          <PostLikeButton postId={postId} />
          <SecondaryButton onClick={onClickComment}>
            <CommentIcon /> Comment
          </SecondaryButton>
        </InteractionBar>
        <CommentList
          referenceId={postId}
          referenceType={CommentReferenceType.Post}
          last={COMMENTS_PER_PAGE}
        />
        <ConditionalRender condition={isComposeBarDisplayed}>
          <CommentComposeBar onSubmit={handleAddComment} />
        </ConditionalRender>
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
        />
      </>
    </ConditionalRender>
  </EngagementBarContainer>
);

UIEngagementBar.propTypes = {
  postId: PropTypes.string,
  totalLikes: PropTypes.number,
  totalComments: PropTypes.number,
  readonly: PropTypes.bool,
  onClickComment: PropTypes.func,
  isComposeBarDisplayed: PropTypes.bool,
  handleAddComment: PropTypes.func,
};

UIEngagementBar.defaultProps = {
  postId: '',
  totalLikes: 0,
  totalComments: 0,
  readonly: false,
  onClickComment: () => {},
  isComposeBarDisplayed: false,
  handleAddComment: () => {},
};

export default customizableComponent('UIEngagementBar', UIEngagementBar);
