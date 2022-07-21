import styled from 'styled-components';

export default styled.div`
  background-color: white;
  width: 280px;
  overflow: auto;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.title}
  height: 100%;
  display: flex;
  flex-direction: column;
`;
