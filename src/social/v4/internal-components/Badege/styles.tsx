import styled from 'styled-components';

export const StyledBadge = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  background-color: ${({ theme }) => theme.palette.primary.shade3};
  color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 20px;
  padding: 0px 6px 0px 4px;
`;
