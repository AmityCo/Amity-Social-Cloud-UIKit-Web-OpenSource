import styled from 'styled-components';

export const Selector = styled.div`
  border: 1px solid #e3e4e8;
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
  border-radius: 4px;
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  max-height: 200px;
  overflow-y: auto;
`;

export const UserSelectorInput = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;
