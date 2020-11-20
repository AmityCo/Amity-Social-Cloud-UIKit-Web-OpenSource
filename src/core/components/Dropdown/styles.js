import styled from 'styled-components';

import { getCssPosition } from '~/helpers';

export const ButtonContainer = styled.div``;

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
  ${({ position, offset }) => getCssPosition(position, offset)}
  ${({ align }) => getCssPosition(align)}
  background: ${({ theme }) => theme.palette.system.background};
  min-width: 15rem;
  padding: 4px 0;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
`;
