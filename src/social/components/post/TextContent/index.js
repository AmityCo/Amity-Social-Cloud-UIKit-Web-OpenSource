import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Highlighter from 'react-highlight-words';

import customizableComponent from '~/core/hocs/customization';
import Linkify from '~/core/components/Linkify';
import Button from '~/core/components/Button';

export const PostContent = styled.div`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const ReadMoreButton = styled(Button).attrs({ variant: 'secondary' })`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
  display: inline-block;
`;

export const Highlighted = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const findChunks = mentionees => {
  if (!mentionees) return [];
  return mentionees.map(({ index, length }) => ({
    start: index,
    end: index + length + 1, // compensate for index === 0
  }));
};

const TextContent = ({ text, postMaxLines, mentionees }) => {
  const textContent = text && (
    <PostContent>
      <Highlighter
        autoEscape
        highlightTag={({ children }) => <Highlighted>{children}</Highlighted>}
        findChunks={() => findChunks(mentionees)}
        textToHighlight={text}
      />
    </PostContent>
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const onExpand = () => setIsExpanded(true);

  return (
    textContent && (
      <Linkify>
        {isExpanded ? (
          textContent
        ) : (
          <Truncate
            lines={postMaxLines}
            ellipsis={
              <ReadMoreButton onClick={onExpand}>
                <FormattedMessage id="post.readMore" />
              </ReadMoreButton>
            }
          >
            {textContent}
          </Truncate>
        )}
      </Linkify>
    )
  );
};

TextContent.propTypes = {
  text: PropTypes.node,
  postMaxLines: PropTypes.number,
};

TextContent.defaultProps = {
  text: '',
  postMaxLines: 8,
};

export default customizableComponent('UITextContent', TextContent);
