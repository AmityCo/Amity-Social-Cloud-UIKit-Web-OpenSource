import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { SecondaryButton } from '~/core/components/Button';
import { ThumbsUp } from '~/icons';

const isLikedStyle = css`
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLikeButton = styled(SecondaryButton)`
  ${({ active }) => active && isLikedStyle}
`;

export const BaseLikeIcon = styled(ThumbsUp)<{ icon?: ReactNode }>`
  font-size: 16px;
  margin-right: 5px;
`;

export const IsLikedLikeIcon = styled(BaseLikeIcon)<{ icon?: ReactNode }>`
  ${isLikedStyle}
`;

export const LikeIcon = ({ isLiked }: { isLiked?: boolean }) =>
  isLiked ? <IsLikedLikeIcon /> : <BaseLikeIcon />;
