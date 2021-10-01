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

export default function LivestreamContent({ streamId }) {
  const stream = useStream(streamId);

  if (!stream.title && !stream.description) {
    return null;
  }

  const text = (
    <TextContainer>
      {stream.title && <div>{stream.title}</div>}
      {stream.description && <div>{stream.description}</div>}
    </TextContainer>
  );

  return <TextContent text={text} />;
}
