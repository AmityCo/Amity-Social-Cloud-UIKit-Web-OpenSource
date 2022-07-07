import React, { useState, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate-markup';
import styled from 'styled-components';
import customizableComponent from '~/core/hocs/customization';
import Button from '~/core/components/Button';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { formatMentionChunks } from '~/core/components/ChunkHighlighter';

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

const TextContent = ({ text, postMaxLines, mentionees }) => {
  const textWithMentions = useMemo(
    () => formatMentionChunks(text, mentionees, 'mention'),
    [text, mentionees],
  );

  const textContent = textWithMentions && (
    <PostContent>
      <Markdown
        options={{
          overrides: {
            mention: {
              component: MentionHighlightTag,
              props: {
                mentionees,
              },
            },
          },
        }}
      >
        {textWithMentions}
      </Markdown>
    </PostContent>
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const onExpand = () => setIsExpanded(true);

  if (textContent && isExpanded) return textContent;

  return (
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
  );
};

TextContent.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  postMaxLines: PropTypes.number,
  mentionees: PropTypes.arrayOf(
    PropTypes.shape({
      index: PropTypes.number,
      length: PropTypes.number,
    }),
  ),
};

TextContent.defaultProps = {
  text: '',
  postMaxLines: 8,
  mentionees: undefined,
};

export default customizableComponent('UITextContent', TextContent);
