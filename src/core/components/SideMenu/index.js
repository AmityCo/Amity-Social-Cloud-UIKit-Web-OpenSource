import styled from 'styled-components';

export default styled.div`
  width: 280px;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.title}
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
`;
