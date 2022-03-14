import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate-markup';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';

import customizableComponent from '~/core/hocs/customization';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import Button from '~/core/components/Button';
import { findChunks } from '~/helpers/utils';

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
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const TextContent = ({ text, postMaxLines, mentionees }) => {
  const textContent = text && (
    <PostContent>
      <Highlighter
        autoEscape
        searchWords={[]} // marked as required by lib
        highlightTag={(props) => (
          <MentionHighlightTag {...props} text={text} mentionees={mentionees} />
        )}
        findChunks={() => findChunks(mentionees, text)}
        textToHighlight={text}
      />
    </PostContent>
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const onExpand = () => setIsExpanded(true);

  if (textContent && isExpanded) return textContent;

  return (
    <Truncate.Atom
      lines={postMaxLines}
      ellipsis={
        <ReadMoreButton onClick={onExpand}>
          <FormattedMessage id="post.readMore" />
        </ReadMoreButton>
      }
    >
      {textContent}
    </Truncate.Atom>
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
