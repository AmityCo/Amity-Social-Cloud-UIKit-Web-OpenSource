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

const LivestreamContent = ({ streamId, mentionees = [] }) => {
  const stream = useStream(streamId);

  if (!stream.title && !stream.description) {
    return null;
  }

  // Mobile platforms also counts stream.title in their index
  // Since we're breaking description into another line, it is necessary
  // to compensate 2 more characters + the title to get correct index for mention highlight
  const descriptionMentionees = mentionees.map(({ index, ...rest }) => ({
    index: index > stream?.title.length ? index - stream?.title.length - 2 : index,
    ...rest,
  }));

  return (
    <TextContainer>
      <div>{stream?.title}</div>
      <TextContent text={stream?.description} mentionees={descriptionMentionees} />
    </TextContainer>
  );
};

export default LivestreamContent;
