import React from 'react';
import styled from 'styled-components';
import useStream from '~/core/hooks/useStream';
import TextContent from '~/social/components/post/TextContent';

const TextContainer = styled.div`
  margin-bottom: 0.75rem;

  > :not(:first-child) {
    margin-top: 0.75rem;
  }
`;

const LivestreamContent = ({ streamId, mentionees }) => {
  const stream = useStream(streamId);

  if (!stream.title && !stream.description) {
    return null;
  }

  return (
    <TextContainer>
      {stream.title && <div>{stream.title}</div>}
      <TextContent text={stream.description} mentionees={mentionees} />
    </TextContainer>
  );
};

export default LivestreamContent;
