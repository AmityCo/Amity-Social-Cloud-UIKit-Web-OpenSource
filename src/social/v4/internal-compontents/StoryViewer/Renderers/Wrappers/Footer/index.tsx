import React, { useEffect } from 'react';
import {
  ViewStoryCompostBarContainer,
  ViewStoryCompostBarEngagementContainer,
  ViewStoryCompostBarViewIconContainer,
  ViewStoryFailedCompostBarContainer,
  ViewStoryFailedCompostBarWrapper,
  ViewStoryUploadingWrapper,
} from './styles';
import { Spinner } from '~/social/v4/internal-compontents/Spinner';
import { DotsIcon, ErrorIcon } from '~/icons';

import { useIntl } from 'react-intl';
import millify from 'millify';

import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';
import { CommentButton, ImpressionButton, ReactButton } from '~/social/v4/elements';

const Footer: React.FC<
  React.PropsWithChildren<{
    storyId: string;
    reach: number | null;
    commentsCount: number;
    totalLikes: number;
    isLiked: boolean;
    onClickComment: () => void;
    syncState?: Amity.SyncState;
  }>
> = ({ syncState, reach, commentsCount, totalLikes, isLiked, storyId, onClickComment }) => {
  const [isActive, setIsActive] = React.useState(isLiked);
  const [likeCount, setLikeCount] = React.useState(totalLikes);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setIsActive(isLiked);
    setLikeCount(totalLikes);
  }, [isLiked, totalLikes]);

  const handleLike = async () => {
    try {
      if (!isLiked) {
        await ReactionRepository.addReaction('story', storyId, LIKE_REACTION_KEY);
      } else {
        await ReactionRepository.removeReaction('story', storyId, LIKE_REACTION_KEY);
      }
    } catch (error) {
      console.error("Can't toggle like", error);
    }
  };

  if (syncState === 'syncing') {
    return (
      <ViewStoryCompostBarContainer>
        <ViewStoryUploadingWrapper>
          <Spinner width={20} height={20} />
          {formatMessage({ id: 'storyViewer.footer.uploading' })}
        </ViewStoryUploadingWrapper>
      </ViewStoryCompostBarContainer>
    );
  }

  if (syncState === 'error') {
    return (
      <ViewStoryFailedCompostBarContainer>
        <ViewStoryFailedCompostBarWrapper>
          <ErrorIcon />
          {formatMessage({ id: 'storyViewer.footer.failed' })}
        </ViewStoryFailedCompostBarWrapper>
        <DotsIcon />
      </ViewStoryFailedCompostBarContainer>
    );
  }

  return (
    <ViewStoryCompostBarContainer>
      <ViewStoryCompostBarViewIconContainer>
        <ImpressionButton pageId="story_page" componentId="*" />
        {millify(reach || 0)}
      </ViewStoryCompostBarViewIconContainer>
      <ViewStoryCompostBarEngagementContainer>
        <CommentButton onClick={onClickComment} pageId="story_page" componentId="*">
          {millify(commentsCount) || 0}
        </CommentButton>
        <ReactButton onClick={handleLike} pageId="story_page" isLiked={isLiked}>
          {millify(likeCount || 0)}
        </ReactButton>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default Footer;
