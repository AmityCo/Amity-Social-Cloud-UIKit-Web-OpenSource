import React from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  // EDD - better resizing for mis-matched images
  // position: relative;
  // width: 100%;
  // height: 0;
  // padding-bottom: ${({ percent }) => percent}%;
  overflow: hidden;
`;

const Cell = styled.div`
  // EDD: remove for better grid styling of different sized images
  // position: absolute;
  // width: 100%;
  // height: 100%;
  // left: 0;
  // top: 0;
  // overflow: hidden;
`;

const Square = ({ className, ratio = 1, children, onClick }) => (
  <Frame className={className} percent={100 * ratio} onClick={onClick}>
    <Cell>{children}</Cell>
  </Frame>
);

export default Square;
