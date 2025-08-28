import styled from 'styled-components';

export const DefaultTrigger = styled.button.attrs({ role: 'button' })`
  display: flex;
  height: 44px;
  min-width: 7rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  justify-self: stretch;
  background-color: #fff;
  color: #000;
  border-radius: 0.5rem;
  border: 1px solid #d3d3d3;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  text-align: left;
  width: 300px;
  > *:last-child {
    margin-left: auto;
  }
  &:hover {
    cursor: pointer;
  }
`;

export const ItemsContainer = styled.div`
  word-break: break-word;
  > * {
    margin: 0 3px;
  }
`;

// Replica della classe .select da global.css come styled component
export const SelectContainer = styled.div`
  display: flex;
  height: 44px;
  min-width: 7rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  align-items: center;
  gap: 0.5rem;
  justify-self: stretch;
  background-color: #fff;
  color: #000;
  border-radius: 0.5rem;
  border: 1px solid #d3d3d3;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
`;
