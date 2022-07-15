import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.base.main};
  width: 100%;
  height: 100%;
  overflow: hidden;
  input,
  div {
    box-sizing: border-box;
  }

  .slate-ToolbarButton-active {
    color: white;
    background-color: var(--chakra-colors-primary-500);
    border-radius: 15%;
  }

  li > p {
    margin: 0;
  }

  & pre {
    ${({ theme }) => theme.typography.body}
  }
`;
