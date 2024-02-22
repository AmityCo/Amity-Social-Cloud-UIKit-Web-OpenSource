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
import { CommentIcon, DotsIcon, ErrorIcon, LikedIcon, ThumbsUp } from '~/icons';

import { useIntl } from 'react-intl';
import millify from 'millify';

const Footer: React.FC<
  React.PropsWithChildren<{
    syncState?: Amity.SyncState;
    reach: number | null;
    commentsCount: number;
    totalLikes: number;
    isLiked: boolean;
    allowCommentInStory: boolean;
    onClickComment: () => void;
    onClickLike: () => void;
  }>
> = ({
  syncState,
  reach,
  commentsCount,
  allowCommentInStory,
  totalLikes,
  isLiked,
  onClickComment,
  onClickLike,
}) => {
  const [isActive, setIsActive] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const { formatMessage } = useIntl();

  const handleLike = () => {
    setIsActive(!isActive);
    setLikeCount(isActive ? totalLikes - 1 : totalLikes + 1);
    onClickLike();
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
  }, [syncState]);

  return (
    <ViewStoryCompostBarContainer>
      <ViewStoryCompostBarViewIconContainer>
        <ViewCountIcon />
        {millify(reach || 0)}
      </ViewStoryCompostBarViewIconContainer>
      <ViewStoryCompostBarEngagementContainer>
        {allowCommentInStory && (
          <ViewStoryCompostBarEngagementButton onClick={onClickComment}>
            <CommentIcon /> {millify(commentsCount) || 0}
          </ViewStoryCompostBarEngagementButton>
        )}
        <ViewStoryCompostBarEngagementButton onClick={handleLike}>
          {!isActive ? <ThumbsUp /> : <LikedIcon />}
          {millify(likeCount || 0)}
        </ViewStoryCompostBarEngagementButton>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default Footer;
