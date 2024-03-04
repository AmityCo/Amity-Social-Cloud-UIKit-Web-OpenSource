import React, { useEffect } from 'react';
import {
  ViewCountIcon,
  ViewStoryCompostBarContainer,
  ViewStoryCompostBarEngagementButton,
  ViewStoryCompostBarEngagementContainer,
  ViewStoryCompostBarViewIconContainer,
  ViewStoryFailedCompostBarContainer,
  ViewStoryFailedCompostBarWrapper,
  ViewStoryUploadingWrapper,
} from './styles';
import Spinner from '~/social/components/Spinner';
import { Comment2Icon, DotsIcon, ErrorIcon, LikedIcon, ThumbsUp } from '~/icons';

import { useIntl } from 'react-intl';
import millify from 'millify';

import { ReactionRepository } from '@amityco/ts-sdk';
import { LIKE_REACTION_KEY } from '~/constants';

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

  useEffect(() => {
    setIsActive(isLiked);
    setLikeCount(totalLikes);
  }, [isLiked, totalLikes]);

  return (
    <ViewStoryCompostBarContainer>
      <ViewStoryCompostBarViewIconContainer>
        <ViewCountIcon />
        {millify(reach || 0)}
      </ViewStoryCompostBarViewIconContainer>
      <ViewStoryCompostBarEngagementContainer>
        <ViewStoryCompostBarEngagementButton onClick={onClickComment}>
          <Comment2Icon /> {millify(commentsCount) || 0}
        </ViewStoryCompostBarEngagementButton>
        <ViewStoryCompostBarEngagementButton onClick={handleLike}>
          {!isActive ? <ThumbsUp /> : <LikedIcon />}
          {millify(likeCount || 0)}
        </ViewStoryCompostBarEngagementButton>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default Footer;
