import React from 'react';
import styled from 'styled-components';

import { ChevronLeft, ChevronRight, Remove } from '~/icons';

export const Container = styled.div`
  z-index: 9999;
  position: fixed;
  overflow: hidden;

  align-items: center;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.75);
  color: ${({ theme }) => theme.palette.system.background};

  user-select: none;

  animation-duration: 0.3s;
  animation-name: appear;

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const InnerContainer = styled.div`
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const GridContainer = styled.div`
  position: relative;
  z-index: 9999;
  display: grid;
  grid-gap: 1rem 3rem;
  grid-template-columns: 2rem auto 2rem;
  grid-template-rows: min-content auto;
  grid-template-areas:
    'none counter close'
    'left image right';

  width: 100%;
  height: 100%;

  padding: 2rem 1rem 2rem 1rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const Image = styled.img.attrs({ loading: 'lazy' })`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const ImageRenderer = (url: string) => <Image key={url} src={url} />;

export const Frame = styled.div`
  z-index: 9999;
  width: 100%;
  height: 100%;
  overflow: hidden;

  position: absolute;
  top: 0;
  left: 0;

  @media (min-width: 768px) {
    position: unset;
    top: unset;
    left: unset;
    grid-area: image;
  }
`;

export const Counter = styled.div`
  grid-area: counter;
  ${({ theme }) => theme.typography.headline}
  text-align: center;
`;

const InvisibleButton = styled.button`
  grid-area: ${({ rel }) => rel};
  appearance: none;
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: inherit;

  &:hover {
    color: ${({ theme }) => theme.palette.neutral.shade4};
  }
`;

type ButtonProps = React.ComponentProps<typeof InvisibleButton>;

export const LeftButton = (props: ButtonProps) => (
  <InvisibleButton rel="left" {...props}>
    <ChevronLeft height="24px" />
  </InvisibleButton>
);

export const RightButton = (props: ButtonProps) => (
  <InvisibleButton rel="right" {...props}>
    <ChevronRight height="24px" />
  </InvisibleButton>
);

const BaseCloseButton = (props: ButtonProps) => (
  <InvisibleButton rel="close" {...props}>
    <Remove height="20px" />
  </InvisibleButton>
);

export const CloseButton = styled(BaseCloseButton)`
  background: rgba(0, 0, 0, 0.3);
  height: 43px;
  width: 43px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
