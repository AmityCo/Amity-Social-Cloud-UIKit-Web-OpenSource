import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { VideoContainer } from '~/core/components/Uploaders/Video/styles';
import { ExclamationCircle } from '~/icons';
import { backgroundImage as livestreamCoverBackground } from '~/icons/LivestreamCover';
import { Message, Thumbnail, VideoPlayerMock } from './styles';

const CircleIcon = styled(ExclamationCircle).attrs({ width: 24, height: 24 })``;

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

export const LivestreamIdleThumbnail = styled((props) => (
  <Thumbnail
    {...props}
    overlayElements={
      <Message>
        <CircleIcon />
        <LivestreamIdleMessage>
          <FormattedMessage id="livestream.idle" />
        </LivestreamIdleMessage>
      </Message>
    }
  />
))`
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

export const LivestreamEndedThumbnail = styled((props) => (
  <Thumbnail
    {...props}
    overlayElements={
      <Message>
        <LivestreamEndedCaption>
          <FormattedMessage id="livestream.ended.caption" />
        </LivestreamEndedCaption>

        <LivestreamEndedMessage>
          <FormattedMessage id="livestream.ended.message" />
        </LivestreamEndedMessage>
      </Message>
    }
  />
))`
  background: #000;
`;

export const LivestreamThumbnail = styled(Thumbnail)`
  background: center / 90% no-repeat ${livestreamCoverBackground} #d9dcec;
`;

export const RecordedBadge = styled((props) => <div {...props}>RECORDED</div>)`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0.25rem;
  color: #fff;
`;

export const LivestreamIdleVideoMessage = () => {
  return (
    <VideoContainer>
      <VideoPlayerMock>
        <Message>
          <CircleIcon />
          <LivestreamIdleMessage>
            <FormattedMessage id="livestream.idle" />
          </LivestreamIdleMessage>
        </Message>
      </VideoPlayerMock>
    </VideoContainer>
  );
};

export const LivestreamEndedVideoMessage = () => {
  return (
    <VideoContainer>
      <VideoPlayerMock>
        <Message>
          <LivestreamEndedCaption>
            <FormattedMessage id="livestream.ended.caption" />
          </LivestreamEndedCaption>

          <LivestreamEndedMessage>
            <FormattedMessage id="livestream.ended.message" />
          </LivestreamEndedMessage>
        </Message>
      </VideoPlayerMock>
    </VideoContainer>
  );
};
