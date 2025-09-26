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
import { CommentIcon, DotsIcon, ErrorIcon, ThumbsUp } from '~/icons';
import { useIntl } from 'react-intl';
import millify from 'millify';

const Footer: React.FC<
  React.PropsWithChildren<{
    syncState?: string;
    reach: number;
    commentsCount: number;
    reactionsCount: number;
  }>
> = ({ syncState, reach, commentsCount, reactionsCount }) => {
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
        <ViewStoryCompostBarEngagementIconContainer>
          <CommentIcon /> {millify(commentsCount) || 0}
        </ViewStoryCompostBarEngagementIconContainer>
        <ViewStoryCompostBarEngagementIconContainer>
          <ThumbsUp /> {millify(reactionsCount || 0)}
        </ViewStoryCompostBarEngagementIconContainer>
      </ViewStoryCompostBarEngagementContainer>
    </ViewStoryCompostBarContainer>
  );
};

export default Footer;
