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

  // CSS resets to avoid inheriting from other other libraries e.g. antd.
  & * {
    font-size: ${({ theme }) => theme.typography.body.fontSize};
    line-height: 1.5;
  }

  & a {
    color: ${({ theme }) => theme.palette.base.main};
    &:hover {
      color: ${({ theme }) => theme.palette.base.main};
    }
  }

  & pre {
    ${({ theme }) => theme.typography.body}
  }
`;
