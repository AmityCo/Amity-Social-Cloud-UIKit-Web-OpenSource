import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body}
  color: ${({ theme }) => theme.palette.base.main};
  width: 100%;
  input,
  div {
    box-sizing: border-box;
  }

  // CSS resets to avoid inheriting from other other libraries e.g. antd.
  & * {
    font-size: ${({ theme }) => theme.typography.body.fontSize};
    line-height: normal;
  }

  & a {
    color: ${({ theme }) => theme.palette.base.main};
    &:hover {
      color: ${({ theme }) => theme.palette.base.main};
    }
  }
`;
