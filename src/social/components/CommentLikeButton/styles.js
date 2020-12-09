import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { SecondaryButton } from '~/core/components/Button';
import customizableComponent from '~/core/hocs/customization';
import { ThumbsUp } from '~/icons';

const isLikedStyle = css`
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLikeButton = styled(SecondaryButton)`
  background-color: transparent;
  ${({ active }) => active && isLikedStyle}
`;

export const LikeIcon = styled(ThumbsUp)`
  font-size: 16px;
  margin-right: 5px;
  ${({ $isLiked }) => $isLiked && isLikedStyle}
`;

const StyledCommentLikeButton = ({ onClick, isActive, isDisabled, totalLikes }) => (
  <StyledLikeButton onClick={onClick} active={isActive} disabled={isDisabled}>
    <LikeIcon $isLiked={isActive} /> {totalLikes > 0 ? totalLikes : ''}
  </StyledLikeButton>
);

StyledCommentLikeButton.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  totalLikes: PropTypes.number,
};

export default customizableComponent('CommentLikeButton', StyledCommentLikeButton);
