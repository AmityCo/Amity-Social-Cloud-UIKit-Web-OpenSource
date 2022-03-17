import styled from 'styled-components';

const Title = styled.h2`
  ${({ theme }) => theme.typography.headline};
  margin: 0 0 1rem 0;
`;

export default Title;
