import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  background: #f7f7f8;
  overflow-y: scroll;
  & > *:nth-child(2) {
    width: 100%;
    padding: 10px;
  }
`;
