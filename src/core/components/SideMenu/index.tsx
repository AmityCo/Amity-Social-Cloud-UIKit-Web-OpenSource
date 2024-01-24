import styled from 'styled-components';

export default styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  width: 280px;
  overflow: auto;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.title}
`;
