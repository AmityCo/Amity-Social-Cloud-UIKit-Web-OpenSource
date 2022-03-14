import React from 'react';
import * as linkify from 'linkifyjs';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Linkify from '~/core/components/Linkify';
import { useNavigation } from '~/social/providers/NavigationProvider';
import { extractUserIdDisplayNameCollection } from '~/helpers/utils';

const Highlighted = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const MentionHighlightTag = ({ children, text, mentionees }) => {
  const { onClickUser } = useNavigation();

  const isLink = linkify.test(children);

  if (isLink) {
    return <Linkify>{children}</Linkify>;
  }

  if (!isEmpty(mentionees)) {
    // Problem: we don't have "displayName" property inside metadata (i.e: mentionees)
    // This hack was used to extract correct users from text along with their userId
    // Not very performant: but this has to stay for Linkify to correctly work
    const { userId: mentioneeId } = mentionees
      .map(({ userId, length, index }) =>
        extractUserIdDisplayNameCollection(text, userId, length, index),
      )
      // Compensate "@" at the start of children (i.e: displayName)
      .find(({ displayName }) => displayName === children.slice(1, children.length));

    return <Highlighted onClick={() => onClickUser(mentioneeId)}>{children}</Highlighted>;
  }

  return children;
};

export default MentionHighlightTag;
