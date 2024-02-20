import React from 'react';
import {
  ViewCountIcon,
  ViewStoryCompostBarContainer,
  ViewStoryCompostBarEngagementContainer,
  ViewStoryCompostBarEngagementIconContainer,
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
    reach: number;
    commentsCount: number;
    isLiked: boolean;
    totalLikes?: number;
    onClickComment: () => void;
    onLike: () => void;
    syncState?: string;
  }>
> = ({ syncState, reach, commentsCount, totalLikes, isLiked, onClickComment, onLike }) => {
  const { formatMessage } = useIntl();

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
        <ViewCountIcon />
        {millify(reach || 0)}
      </ViewStoryCompostBarViewIconContainer>
      <ViewStoryCompostBarEngagementContainer>
        <ViewStoryCompostBarEngagementIconContainer onClick={onClickComment}>
          <CommentIcon /> {millify(commentsCount) || 0}
        </ViewStoryCompostBarEngagementIconContainer>
        <ViewStoryCompostBarEngagementIconContainer>
          {!isLiked ? <ThumbsUp onClick={onLike} /> : <LikedIcon onClick={onLike} />}
          {millify(totalLikes || 0)}
        </ViewStoryCompostBarEngagementIconContainer>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default Footer;
