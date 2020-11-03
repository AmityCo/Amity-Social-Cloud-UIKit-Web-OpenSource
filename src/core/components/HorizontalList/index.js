import React from 'react';
import styled from 'styled-components';

const ScrollContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

const StretchedList = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  & > * {
    flex: 0 0 auto;
  }
`;

export default ({ children }) => (
  <ScrollContainer>
    <StretchedList>{children}</StretchedList>
  </ScrollContainer>
);
