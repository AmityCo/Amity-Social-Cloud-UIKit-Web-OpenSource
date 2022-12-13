import React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import { useNavigation } from '~/social/providers/NavigationProvider';

const Highlighted = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const MentionHighlightTag = ({ children, mentionees, highlightIndex }) => {
  const { onClickUser } = useNavigation();

  if (!isEmpty(mentionees)) {
    const { userId: mentioneeId } = mentionees[highlightIndex];

    return (
      <Highlighted data-qa-anchor="mention-hilight-tag" onClick={() => onClickUser(mentioneeId)}>
        {children}
      </Highlighted>
    );
  }

  return children;
};

export default MentionHighlightTag;
