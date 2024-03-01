import React from 'react';
import styled from 'styled-components';
import { EllipsisH } from '~/icons';
import { CommentInteractionButton } from '~/social/v4/components/Comment/styles';

const StyledEllipsisH = styled(EllipsisH)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.palette.neutral.shade2};
`;

interface OverflowMenuProps {
  onClick: () => void;
}

export const OverflowMenu = ({ onClick }: OverflowMenuProps) => {
  return (
    <CommentInteractionButton onClick={onClick}>
      <StyledEllipsisH />
    </CommentInteractionButton>
  );
};
