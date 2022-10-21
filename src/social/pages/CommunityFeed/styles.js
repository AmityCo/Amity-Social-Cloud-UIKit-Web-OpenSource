import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  max-width: 695px;
  overflow-y: auto;
`;

export const DeclineBanner = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  color: ${({ theme }) => theme.palette.base.shade1};
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 4px;
`;
