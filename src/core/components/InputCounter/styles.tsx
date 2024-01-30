import styled from 'styled-components';

import { Minus, Plus } from '~/icons';

export const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

export const ResultContainer = styled.div`
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

export const CircleButton = styled.button`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:disabled) {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const MinusIcon = styled(Minus).attrs({ width: 24, height: 24 })``;
export const PlusIcon = styled(Plus)`
  font-size: 24px;
`;
