import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import customizableComponent from '~/core/hocs/customization';
import { SecondaryButton } from '~/core/components/Button';
import { ThumbsUp } from '~/icons';

const isLikedStyle = css`
  color: ${({ theme }) => theme.palette.primary.main};
`;

export const StyledLikeButton = styled(SecondaryButton)`
  ${({ isActive }) => isActive && isLikedStyle}
`;

export const LikeIcon = styled(ThumbsUp).attrs({ width: 16, height: 16 })`
  margin-right: 5px;
  ${({ $isLiked }) => $isLiked && isLikedStyle}
`;
/**
 * This can be customised by a ui-kit user.
 * They can replace it with any other presentational component with the same props interface.
 */
const StyledPostLikeButton = ({ onClick, isActive, isDisabled }) => (
  <StyledLikeButton
    isActive={isActive}
    disabled={isDisabled}
    data-qa-anchor="social-like-post"
    onClick={onClick}
  >
    <LikeIcon $isLiked={isActive} /> <FormattedMessage id={isActive ? 'post.liked' : 'post.like'} />
  </StyledLikeButton>
);

StyledPostLikeButton.propTypes = {
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default customizableComponent('PostLikeButton', StyledPostLikeButton);
