import React from 'react';
import styled from 'styled-components';

const Frame = styled.div`
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

const Square = ({ className, ratio = 1, children }) => (
  <Frame className={className} percent={100 * ratio}>
    <Cell>{children}</Cell>
  </Frame>
);

export default Square;
