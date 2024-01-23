import React from 'react';
import {
  ViewStoryCompostBarContainer,
  ViewStoryCompostBarViewIconContainer,
  ViewStoryCompostBarEngagementContainer,
  ViewStoryCompostBarEngagementIconContainer,
  ViewCountIcon,
  ViewStoryFailedCompostBarContainer,
  ViewStoryFailedCompostBarWrapper,
} from './styles';
import { AlertCircleIcon, CommentIcon, DotsIcon, LikeIcon } from '~/V4/icons';
import { useIntl } from 'react-intl';

type StoryViewerFooterProps = {
  viewCount: string;
  commentCount: string;
  likeCount: string;
  viewIcon?: React.ReactNode;
  commentIcon?: React.ReactNode;
  likeIcon?: React.ReactNode;
  isUploading?: boolean;
  isErrored?: boolean;
};

const StoryViewerFooter = ({
  viewCount,
  commentCount,
  likeCount,
  viewIcon = <ViewCountIcon />,
  commentIcon = <CommentIcon />,
  likeIcon = <LikeIcon />,
  isUploading = false,
  isErrored = false,
}: StoryViewerFooterProps) => {
  const { formatMessage } = useIntl();
  if (isErrored) {
    return (
      <ViewStoryFailedCompostBarContainer>
        <ViewStoryFailedCompostBarWrapper>
          <AlertCircleIcon />
          {formatMessage({ id: 'storyViewer.footer.failed' })}
        </ViewStoryFailedCompostBarWrapper>
        <DotsIcon />
      </ViewStoryFailedCompostBarContainer>
    );
  }

  if (isUploading) {
    return (
      <ViewStoryCompostBarContainer>
        {formatMessage({ id: 'storyViewer.footer.uploading' })}
      </ViewStoryCompostBarContainer>
    );
  }

  return (
    <ViewStoryCompostBarContainer>
      <ViewStoryCompostBarViewIconContainer>
        {viewIcon}
        {viewCount}
      </ViewStoryCompostBarViewIconContainer>
      <ViewStoryCompostBarEngagementContainer>
        <ViewStoryCompostBarEngagementIconContainer>
          {commentIcon} {commentCount}
        </ViewStoryCompostBarEngagementIconContainer>
        <ViewStoryCompostBarEngagementIconContainer>
          {likeIcon} {likeCount}
        </ViewStoryCompostBarEngagementIconContainer>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default StoryViewerFooter;
