import styled from 'styled-components';

import UIOptionMenu from '~/core/components/OptionMenu';
import { PrimaryButton } from '~/core/components/Button';
import { Plus, Pencil } from '~/icons';

export const PlusIcon = styled(Plus)`
  font-size: 15px;
  margin-right: 8px;
`;

export const PencilIcon = styled(Pencil)`
  font-size: 15px;
  margin-right: 4px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  margin-left: auto;
`;

export const Container = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
  width: 20rem;
  flex-shrink: 0;
  align-self: flex-start;
  padding: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const CategoriesList = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.palette.base.shade1};
  word-break: break-word;
`;

export const Count = styled.span`
  & > .countNumber {
    ${({ theme }) => theme.typography.bodyBold}
  }
`;

export const Description = styled.div`
  margin: 8px 0 12px;
  word-break: break-all;
`;

export const JoinButton = styled(PrimaryButton)`
  width: 100%;
  justify-content: center;
`;

export const CountsContainer = styled.div`
  margin-bottom: 12px;
  & > ${Count} {
    margin-right: 8px;
  }
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
