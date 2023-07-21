import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1450px;
  margin: 20px auto;

  overflow-x: hidden;
  overflow-y: auto;

  display: grid;
  grid-template-columns: 100%;
  grid-gap: 1.5rem;

  > div {
    margin: 0 20px;
  }
  .mobile-communities-list {
    margin: 0;
  }
`;
