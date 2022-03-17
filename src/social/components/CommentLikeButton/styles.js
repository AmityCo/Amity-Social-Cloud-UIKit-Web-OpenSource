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

  > :not(:first-child) {
    margin-left: 5px;
  }
`;

export const LikeIcon = styled(ThumbsUp).attrs({ width: 16, height: 16 })`
  ${({ $isLiked }) => $isLiked && isLikedStyle}
`;

const StyledCommentLikeButton = ({ onClick, isActive, isDisabled, totalLikes }) => (
  <StyledLikeButton active={isActive} disabled={isDisabled} onClick={onClick}>
    <LikeIcon $isLiked={isActive} /> {totalLikes > 0 ? <span>{totalLikes}</span> : ''}
  </StyledLikeButton>
);

StyledCommentLikeButton.propTypes = {
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  totalLikes: PropTypes.number,
  onClick: PropTypes.func,
};

export default customizableComponent('CommentLikeButton', StyledCommentLikeButton);
