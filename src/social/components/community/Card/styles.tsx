import styled, { css } from 'styled-components';

import SocialCommunityName from '~/social/components/community/Name';

export const Container = styled.div`
  min-width: 278px;
  min-height: 289px;
  cursor: pointer;
  box-shadow: 0 0 1px rgba(40, 41, 61, 0.08), 0 0.5px 2px rgba(96, 97, 112, 0.16);
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  overflow: hidden;
`;

export const Cover = styled.div<{ backgroundImage?: string }>`
  padding-top: 74.46%;
  position: relative;

  ${({ backgroundImage, theme }) => css`
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 42.03%, rgba(0, 0, 0, 0.5) 100%),
      ${backgroundImage ? `url(${CSS.escape(backgroundImage)})` : theme.palette.base.shade3};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  `}
`;

export const CoverContent = styled.div`
  position: absolute;
  bottom: 12px;
  left: 16px;
  right: 16px;
`;

export const CommunityName = styled(SocialCommunityName)`
  color: #ffffff;
  ${({ theme }) => theme.typography.headline}
  line-height: 30px !important;

  * {
    color: #ffffff;
    line-height: 30px !important;
    padding: 0;
  }
`;

export const CategoriesList = styled.div`
  word-break: break-word;
  color: #ffffff;
  margin-bottom: 0;
  line-height: 20px;
  ${({ theme }) => theme.typography.body}
`;

export const Content = styled.div`
  padding: 12px 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const Count = styled.div`
  color: ${({ theme }) => theme.palette.neutral.shade1};
  ${({ theme }) => theme.typography.caption}
  margin-bottom: 4px;
`;

export const Description = styled.div`
  ${({ theme }) => theme.typography.caption}
`;
