import styled from 'styled-components';

import { SIZES } from '~/core/hocs/withSize';

export const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;

  ${({ size, backgroundImage, theme }) => `
    height: ${SIZES[size]}px;
    width: ${SIZES[size]}px;
    background: ${backgroundImage || theme.palette.base.shade3}};
  `}

  border-radius: 50%;

  &.visible img {
    opacity: 1;
  }
`;

export const AvatarOverlay = styled.div`
  position: absolute;
  z-index: 2;
  opacity: 0.5;
  background-color: #000000;

  ${({ size }) => `
    height: ${SIZES[size]}px;
    width: ${SIZES[size]}px;
  `}
`;

export const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s;
`;

export const FileInput = styled.input.attrs({ type: 'file' })`
  &&& {
    display: none;
  }
`;

export const Label = styled.label``;
