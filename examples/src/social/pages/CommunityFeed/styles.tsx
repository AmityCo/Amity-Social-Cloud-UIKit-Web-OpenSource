import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 28px 0;
  overflow-y: auto;
`;

export const DeclineBanner = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  color: ${({ theme }) => theme.palette.base.shade1};
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 4px;
`;
