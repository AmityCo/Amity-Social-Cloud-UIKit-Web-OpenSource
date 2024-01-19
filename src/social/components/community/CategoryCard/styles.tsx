import styled from 'styled-components';

export const Container = styled.div<{ backgroundImage?: string }>`
  min-width: 160px;
  min-height: 150px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  ${({ backgroundImage, theme }) => `
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 42.03%, rgba(0, 0, 0, 0.5) 100%), ${
      backgroundImage ? `url(${CSS.escape(backgroundImage)})` : theme.palette.base.shade3
    };
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  `}
`;

export const Content = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
`;

export const Name = styled.h4`
  color: #ffffff;
  ${({ theme }) => theme.typography.title}
  margin: 0;
`;
