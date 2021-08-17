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
  ${({ active }) => active && isLikedStyle}
`;

export const LikeIcon = styled(ThumbsUp)`
  font-size: 16px;
  margin-right: 5px;
  ${({ $isLiked }) => $isLiked && isLikedStyle}
`;
/**
 * This can be customised by a ui-kit user.
 * They can replace it with any other presentational component with the same props interface.
 */
const StyledPostLikeButton = ({ onClick, isActive, isDisabled }) => (
  <StyledLikeButton
    onClick={onClick}
    active={isActive}
    disabled={isDisabled}
    data-qa-anchor="social-like-post"
  >
    <LikeIcon $isLiked={isActive} /> <FormattedMessage id={isActive ? 'post.liked' : 'post.like'} />
  </StyledLikeButton>
);

StyledPostLikeButton.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default customizableComponent('PostLikeButton', StyledPostLikeButton);
