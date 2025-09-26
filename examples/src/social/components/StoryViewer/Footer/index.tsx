import React from 'react';
import {
  ViewStoryCompostBarContainer,
  ViewStoryCompostBarViewIconContainer,
  ViewStoryCompostBarEngagementContainer,
  ViewStoryCompostBarEngagementIconContainer,
  ViewCountIcon,
  ViewStoryFailedCompostBarContainer,
  ViewStoryFailedCompostBarWrapper,
  ViewStoryUploadingWrapper,
} from './styles';

import { useIntl } from 'react-intl';
import Spinner from '../../Spinner';
import { Comment, DotsIcon, ErrorIcon, LikeIcon } from '~/icons';

type StoryViewerFooterProps = {
  viewCount: string;
  commentCount: string;
  likeCount: string;
  syncState?: Amity.SyncState;
  viewIcon?: React.ReactNode;
  commentIcon?: React.ReactNode;
  likeIcon?: React.ReactNode;
};

const StoryViewerFooter = ({
  viewCount,
  commentCount,
  likeCount,
  syncState,
  viewIcon = <ViewCountIcon />,
  commentIcon = <Comment />,
  likeIcon = <LikeIcon />,
}: StoryViewerFooterProps) => {
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
