import styled from 'styled-components';

export const DefaultTrigger = styled.button.attrs({ role: 'button' })`
  color: ${({ theme }) => theme.palette.base.shade1};
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.palette.system.borders};
  outline: none;
  background: none;
  padding: 8px;
  text-align: left;
  display: flex;
  align-items: center;
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
