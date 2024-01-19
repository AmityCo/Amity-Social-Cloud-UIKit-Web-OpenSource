import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';
import { ThumbsUp } from '~/icons';

const isLikedStyle = css`
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLikeButton = styled(SecondaryButton)`
  background-color: transparent;
  ${({ active }) => active && isLikedStyle}

  > :not(:first-child) {
    margin-left: 5px;
  }
`;

export const BaseLikeIcon = styled(ThumbsUp).attrs<{ icon?: ReactNode }>({ width: 16, height: 16 })`
  font-size: 16px;
`;

export const IsLikedLikeIcon = styled(BaseLikeIcon)<{ icon?: ReactNode }>`
  ${isLikedStyle}
`;

export const LikeIcon = ({ isLiked }: { isLiked?: boolean }) =>
  isLiked ? <IsLikedLikeIcon /> : <BaseLikeIcon />;

interface StyledCommentLikeButtonProps {
  isActive?: boolean;
  isDisabled?: boolean;
  totalLikes?: number;
  onClick?: () => void;
}

const StyledCommentLikeButton = ({
  onClick,
  isActive,
  isDisabled,
  totalLikes,
}: StyledCommentLikeButtonProps) => (
  <StyledLikeButton active={isActive} disabled={isDisabled} onClick={onClick}>
    <LikeIcon isLiked={isActive} /> {totalLikes && totalLikes > 0 ? <span>{totalLikes}</span> : ''}
  </StyledLikeButton>
);

export default StyledCommentLikeButton;
