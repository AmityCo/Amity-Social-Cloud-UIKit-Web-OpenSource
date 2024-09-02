import styled from 'styled-components';

import skeletonCss from 'react-loading-skeleton/dist/skeleton.css?inline';

export const UIStyles = styled.div`
  color-scheme: only light;
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

  & pre {
    ${({ theme }) => theme.typography.body}
  }

  @keyframes react-loading-skeleton {
    100% {
      transform: translateX(100%);
    }
  }

  ${skeletonCss}
`;
