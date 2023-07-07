import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import styled from 'styled-components';
import Button from '~/core/components/Button';
import ChunkHighlighter from '~/core/components/ChunkHighlighter';
import Linkify from '~/core/components/Linkify';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import customizableComponent from '~/core/hocs/customization';
import { findChunks } from '~/helpers/utils';

export const PostContent = styled.div`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  margin-bottom: 12px;
  ${({ theme }) => theme.typography.body}
`;

export const ReadMoreButton = styled(Button).attrs({ variant: 'secondary' })`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
  display: inline-block;
`;

const TextContent = ({ text, postMaxLines, mentionees }) => {
  const chunks = useMemo(() => findChunks(mentionees), [mentionees]);

  const textContent = text && (
    <PostContent data-qa-anchor="post-text-content">
      <ChunkHighlighter
        textToHighlight={text}
        chunks={chunks}
        highlightNode={(props) => <MentionHighlightTag {...props} mentionees={mentionees} />}
        unhighlightNode={Linkify}
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
