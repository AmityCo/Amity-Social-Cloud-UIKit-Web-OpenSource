import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { Mentioned } from '~/helpers/utils';

const Highlighted = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
`;

interface MentionHighlightTagProps {
  children: ReactNode;
  mentionee: Mentioned;
}

const MentionHighlightTag = ({ children, mentionee }: MentionHighlightTagProps) => {
  const { onClickUser } = useNavigation();

  const { userId: mentioneeId } = mentionee;

  return (
    <Highlighted data-qa-anchor="mention-hilight-tag" onClick={() => onClickUser(mentioneeId)}>
      {children}
    </Highlighted>
  );
};

export default MentionHighlightTag;
