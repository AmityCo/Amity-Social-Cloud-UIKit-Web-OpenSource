import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import { ExclamationCircle } from '~/icons';
import { backgroundImage as liveStreamCoverBackground } from '~/icons/LivestreamCover';
import { Message, Thumbnail, VideoPlayer } from './styles';

const CircleIcon = styled(ExclamationCircle).attrs<{ icon?: ReactNode }>({ width: 24, height: 24 })`
  && {
    font-size: 24px;
  }
`;

export const LivestreamOverlayElements = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  max-width: calc(100% - 1.5rem);

  > :not(:first-child) {
    margin-top: 0.5rem;
  }
`;

export const LivestreamTitle = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  color: #fff;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
`;

const LivestreamIdleMessage = styled.div`
  margin-top: 0.5rem;
`;

export type LivestreamIdleThumbnailProps = React.ComponentProps<typeof Thumbnail>;

const BaseLivestreamIdleThumbnail = (props: LivestreamIdleThumbnailProps) => (
  <Thumbnail
    {...props}
    overlayElements={
      <Message>
        <CircleIcon />
        <LivestreamIdleMessage>
          <FormattedMessage id="liveStream.idle" />
        </LivestreamIdleMessage>
      </Message>
    }
  />
);

export const LivestreamIdleThumbnail = styled(BaseLivestreamIdleThumbnail)`
  background: #000;
`;

const LivestreamEndedCaption = styled.div`
  && {
    ${({ theme }) => theme.typography.title}
  }
`;

const LivestreamEndedMessage = styled.div`
  margin: 2px auto 0 auto;
  max-width: 15.5rem;
`;

export type LivestreamEndedThumbnailProps = React.ComponentProps<typeof Thumbnail>;

const BaseLivestreamEndedThumbnail = (props: LivestreamEndedThumbnailProps) => (
  <Thumbnail
    {...props}
    overlayElements={
      <Message>
        <LivestreamEndedCaption>
          <FormattedMessage id="liveStream.ended.caption" />
        </LivestreamEndedCaption>

        <LivestreamEndedMessage>
          <FormattedMessage id="liveStream.ended.message" />
        </LivestreamEndedMessage>
      </Message>
    }
  />
);

export const LivestreamEndedThumbnail = styled(BaseLivestreamEndedThumbnail)`
  background: #000;
`;

export const LivestreamThumbnail = styled(Thumbnail)`
  background: center / 90% no-repeat ${liveStreamCoverBackground} #d9dcec;
`;

const BaseRecordedBadge = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>RECORDED</div>
);

export const RecordedBadge = styled(BaseRecordedBadge)`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0.25rem;
  color: #fff;
`;

export const LivestreamIdleVideoMessage = () => {
  return (
    <VideoContainer>
      <VideoPlayer>
        <Message>
          <CircleIcon />
          <LivestreamIdleMessage>
            <FormattedMessage id="liveStream.idle" />
          </LivestreamIdleMessage>
        </Message>
      </VideoPlayer>
    </VideoContainer>
  );
};

export const LivestreamEndedVideoMessage = () => {
  return (
    <VideoContainer>
      <VideoPlayer>
        <Message>
          <LivestreamEndedCaption>
            <FormattedMessage id="liveStream.ended.caption" />
          </LivestreamEndedCaption>

          <LivestreamEndedMessage>
            <FormattedMessage id="liveStream.ended.message" />
          </LivestreamEndedMessage>
        </Message>
      </VideoPlayer>
    </VideoContainer>
  );
};
