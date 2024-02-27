import styled from 'styled-components';
import { ReactNode } from 'react';

import UIOptionMenu from '~/core/components/OptionMenu';
import { PrimaryButton } from '~/core/components/Button';
import { Plus, Pencil } from '~/icons';
import SocialCommunityName from '~/social/components/community/Name';

export const PlusIcon = styled(Plus).attrs<{ icon?: ReactNode }>({ width: 15, height: 15 })`
  margin-right: 8px;
`;

export const PencilIcon = styled(Pencil).attrs<{ icon?: ReactNode }>({ width: 15, height: 15 })`
  margin-right: 4px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  margin-left: auto;
  margin-right: 0;

  & .leave-community {
    color: ${({ theme }) => theme.palette.alert.main};
  }
`;

export const Container = styled.div`
  border: 1px solid #ebecef;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  flex-shrink: 0;
  align-self: flex-start;
  margin-bottom: 12px;
`;

export const Cover = styled.div<{ backgroundImage?: string }>`
  padding-top: 56.25%;
  position: relative;

  ${({ backgroundImage, theme }) => `
    background: linear-gradient(360deg, rgba(0, 0, 0, 0.5) -4.5%, rgba(0, 0, 0, 0) 77.17%), ${
      backgroundImage ? `url(${CSS.escape(backgroundImage)})` : theme.palette.base.shade3
    };
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  `}
`;

export const CoverContent = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
`;

export const CommunityName = styled(SocialCommunityName)`
  color: #ffffff;
  ${({ theme }) => theme.typography.headline}
  line-height: 30px !important;

  * {
    line-height: 30px !important;
  }
`;

export const Content = styled.div`
  padding: 18px 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const CategoriesList = styled.div`
  word-break: break-word;
  color: #ffffff;
  margin-bottom: 0;
  line-height: 20px;
  ${({ theme }) => theme.typography.body}
`;

export const Count = styled.span`
  & > .countNumber {
    ${({ theme }) => theme.typography.title};
    color: ${({ theme }) => theme.palette.base.default};
  }

  & > .countType {
    ${({ theme }) => theme.typography.body};
    color: ${({ theme }) => theme.palette.base.shade2};
  }
`;

export const Divider = styled.div`
  display: inline-block;
  width: 1px;
  margin: 12px 0;
  background: ${({ theme }) => theme.palette.base.shade4};
`;

export const Description = styled.div`
  margin-bottom: 20px;
`;

export const JoinButton = styled(PrimaryButton)`
  width: 100%;
  justify-content: center;
`;

export const CountsContainer = styled.div`
  display: flex;
  gap: 20px;
`;

export const PendingPostsBannerContainer = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  padding: 12px;
  margin-top: 8px;
  border-radius: 4px;
  text-align: center;
`;

export const PendingPostsBannerTitle = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PendingPostsBannerTitleBadge = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.palette.primary.main};
  margin-right: 6px;
`;

export const PendingPostsBannerMessage = styled.div`
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.shade1};
`;
