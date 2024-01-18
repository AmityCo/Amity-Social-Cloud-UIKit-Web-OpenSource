import styled from 'styled-components';

import { getCssPosition } from '~/helpers';

export const ButtonContainer = styled.div`
  > *:disabled {
    cursor: default;
    background: ${({ theme }) => theme.palette.base.shade3};
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
  display: block;
`;

export const FrameContainer = styled.div`
  overflow: hidden;
`;

export const Frame = styled.div`
  position: absolute;
  z-index: 2;
  ${({ position }) => getCssPosition(position)}
  ${({ align }) => align && getCssPosition(align)}
  background: ${({ theme }) => theme.palette.system.background};
  ${({ fullSized }) => (fullSized ? `width: 100%;` : `min-width: 15rem;`)}
  ${({ scrollable, scrollableHeight }) =>
    scrollable &&
    `
    max-height: ${scrollableHeight}px;
    overflow-y: auto;
  `}
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;
