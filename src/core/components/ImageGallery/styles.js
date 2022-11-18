import React from 'react';
import styled from 'styled-components';

import { ChevronLeft, ChevronRight, Remove } from '~/icons';

export const Container = styled.div`
  z-index: 9999;
  position: fixed;
  overflow: hidden;
  display: grid;
  grid-gap: 0;
  grid-template-columns: 3rem auto 3rem;
  grid-template-rows: min-content auto;
  grid-template-areas:
    'none counter close'
    'left image right';

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

  @media (min-width: 960px) {
    grid-gap: 1rem 3rem;
    padding: 3rem;
  }

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const ImageRenderer = (url) => <Image key={url} src={url} />;

export const Frame = styled.div`
  grid-area: image;
  width: 100%;
  height: 100%;
  overflow: hidden;
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

export const LeftButton = (props) => (
  <InvisibleButton rel="left" {...props}>
    <ChevronLeft height={24} />
  </InvisibleButton>
);

export const RightButton = (props) => (
  <InvisibleButton rel="right" {...props}>
    <ChevronRight height={24} />
  </InvisibleButton>
);

export const CloseButton = styled((props) => (
  <InvisibleButton rel="close" {...props}>
    <Remove height={20} />
  </InvisibleButton>
))`
  background: rgba(0, 0, 0, 0.3);
  height: 43px;
  width: 43px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
