import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Skeleton from '~/core/components/Skeleton';

import { SIZES, SIZE_ALIAS } from '~/core/hooks/useSize';

interface AvatarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  size: ValueOf<typeof SIZE_ALIAS> | string;
  backgroundImage?: string | null;
  children?: ReactNode;
}

const AvatarContainerComponent: React.FC<AvatarContainerProps> = ({
  loading,
  size,
  backgroundImage,
  children,
  ...props
}) => {
  return (
    <div {...props}>
      {loading ? (
        <Skeleton circle width="100%" height="100%" style={{ display: 'block' }} />
      ) : (
        children
      )}
    </div>
  );
};

export const AvatarContainer = styled(AvatarContainerComponent)<{ className?: string }>`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;

  border-radius: 50%;

  &.visible img {
    opacity: 1;
  }

  &.clickable {
    &:hover {
      cursor: pointer;
    }
  }

  ${({ size, backgroundImage, theme }) => `
    height: ${SIZES[size]}px;
    width: ${SIZES[size]}px;
    background: ${backgroundImage || theme.palette.base.shade3}};
  `};
`;

export const AvatarOverlay = styled.div<{ size: ValueOf<typeof SIZE_ALIAS> }>`
  position: absolute;
  z-index: 2;
  opacity: 0.5;
  background-color: #000000;

  ${({ size }) => `
    height: ${SIZES[size]}px;
    width: ${SIZES[size]}px;
  `}
`;

export const Img = styled.img.attrs({ loading: 'lazy' })`
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

export const Label = styled.label<{ disabled?: boolean }>``;
