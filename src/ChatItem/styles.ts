import styled from 'styled-components';

export const ChatItemContainer = styled.div`
  background-color: white;
  border-bottom: 1px solid #e6e6e6;
  height: 40px;
  padding: 10px;
  ${({ selected }) => selected && 'border-left: 8px solid rgba(41, 203, 114, 0.74);'}
  cursor: pointer;
`;
