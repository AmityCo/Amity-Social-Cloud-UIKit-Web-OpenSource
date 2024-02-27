import React, { ReactNode, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { SizeMe } from 'react-sizeme';

import Button from '~/core/components/Button';
import Skeleton from '~/core/components/Skeleton';

import RemoveIcon from '~/icons/Remove';
import ExclamationCircle from '~/icons/ExclamationCircle';

export const ImageContainer = styled.div<{ border?: boolean }>`
  position: relative;
  display: inline-block;
  min-width: 2em;
  min-height: 2em;
  width: 100%;
  height: 100%;
  border: ${({ theme, border }) => border && `1px solid ${theme.palette.base.shade4}`};
  border-radius: 4px;
  overflow: hidden;

  .darken {
    opacity: 0.4;
  }
`;

export const Content = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ImgPreviewContainerStyles = css<{ mediaFit?: string; loading?: string }>`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: ${({ mediaFit }) => mediaFit ?? 'cover'};
  object-position: center;
`;

export const ImgPreview = styled.img.attrs<{ mediaFit?: string; loading?: string }>({
  loading: 'lazy',
})`
  ${ImgPreviewContainerStyles}
`;

export const SkeletonWrapper = styled.div<{ mediaFit?: string; loading?: string }>`
  ${ImgPreviewContainerStyles};

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ImageSkeleton = () => (
  <SizeMe monitorHeight>
    {({ size }) => {
      const minSize = Math.min(size?.width || 0, size?.height || 0);

      return (
        <SkeletonWrapper>
          <Skeleton
            borderRadius={0}
            height={minSize}
            width={minSize}
            style={{ display: 'block' }}
          />
        </SkeletonWrapper>
      );
    }}
  </SizeMe>
);

export const RemoveButton = styled(Button).attrs<{
  variant?: string;
  children?: ReactNode;
}>({
  variant: 'secondary',
  children: <RemoveIcon />,
})`
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

export const CircleIcon = styled(ExclamationCircle).attrs<{ icon?: ReactNode }>({ width: 24, height: 24 })`
  z-index: 2;
  opacity: 0.7;
`;

export const RetryButton = styled(Button).attrs<{
  variant?: string;
  children?: ReactNode;
}>({
  variant: 'secondary',
  children: <CircleIcon />,
})`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
`;

export const ButtonContainer = styled.div`
  display: flex;
`;
