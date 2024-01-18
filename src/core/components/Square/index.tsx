import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Frame = styled.div<{ percent: number; className?: string }>`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: ${({ percent }) => percent}%;
  overflow: hidden;
`;

const Cell = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
`;

export interface SquareProps {
  className?: string;
  ratio?: number;
  onClick?: () => void;
  children: ReactNode;
}

const Square = ({ className, ratio = 1, children, onClick }: SquareProps) => (
  <Frame className={className} percent={100 * ratio} onClick={onClick}>
    <Cell>{children}</Cell>
  </Frame>
);

export default Square;
