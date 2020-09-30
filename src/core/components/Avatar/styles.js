import styled from 'styled-components';

import { SIZES } from '~/core/hocs/withSize';
import { backgroundImage as UserImage } from '~/icons/User';

export const AvatarContainer = styled.div`
  flex-shrink: 0;
  overflow: hidden;

  ${({ size, backgroundImage }) => `
    height: ${SIZES[size]}px;
    width: ${SIZES[size]}px;
    background: ${backgroundImage || UserImage}
  `}

  border-radius: 50%;

  &.visible img {
    opacity: 1;
  }
`;

export const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
`;
