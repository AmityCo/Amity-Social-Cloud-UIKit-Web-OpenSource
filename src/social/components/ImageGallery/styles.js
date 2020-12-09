import styled from 'styled-components';

import { ChevronLeft, ChevronRight, Close } from '~/icons';

export const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

export const ImageGalleryContainer = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 12px auto 12px;
  align-items: center;
  width: 100%;
  overflow: hidden;

  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(23, 24, 28, 0.8);
  color: white;

  padding: 60px;
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

export const Counter = styled.div`
  text-align: center;
  padding-bottom: 10px;
  ${({ theme }) => theme.typography.headline}
`;

export const CloseIcon = styled(Close)`
  position: absolute;
  top: 60px;
  right: 60px;
  font-size: 24px;
  cursor: pointer;
`;

export const RightIcon = styled(ChevronRight)`
  font-size: 24px;
  cursor: pointer;
  justify-self: right;
`;

export const LeftIcon = styled(ChevronLeft)`
  font-size: 24px;
  cursor: pointer;
`;
