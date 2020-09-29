import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/pro-regular-svg-icons';
import { SecondaryButton } from 'components/Button';
import { customizableComponent } from 'hocs/customization';

const isLikedStyle = css`
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLikeButton = styled(SecondaryButton)`
  background-color: transparent;
  ${({ active }) => active && isLikedStyle}
`;

export const LikeIcon = styled(FaIcon).attrs({ icon: faThumbsUp })`
  font-size: 16px;
  margin-right: 5px;
  ${({ isLiked }) => isLiked && isLikedStyle}
`;

const StyledCommentLikeButton = ({ onClick, isActive, isDisabled, totalLikes }) => (
  <StyledLikeButton onClick={onClick} active={isActive} disabled={isDisabled}>
    <LikeIcon isLiked={isActive} /> {totalLikes > 0 ? totalLikes : ''}
  </StyledLikeButton>
);

StyledCommentLikeButton.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  totalLikes: PropTypes.number,
};

export default customizableComponent('CommentLikeButton', StyledCommentLikeButton);
