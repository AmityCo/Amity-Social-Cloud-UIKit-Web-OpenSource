import styled from 'styled-components';

export const InfiniteScrollContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  overflow: auto;
  background: linear-gradient(#c2a0b5, #300155);
`;

export const MessageListContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 0 20px;
`;
