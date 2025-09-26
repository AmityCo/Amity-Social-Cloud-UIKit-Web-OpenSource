import styled from 'styled-components';

import Button from '~/core/components/Button';

export const PageContainer = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  padding: 30px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

export const Title = styled.div`
  ${({ theme }) => theme.typography.headline}
`;

export const BackButton = styled(Button).attrs({ variant: 'secondary' })`
  width: 28px;
  padding: 2px;

  &:hover {
    background-color: transparent;
  }
`;
