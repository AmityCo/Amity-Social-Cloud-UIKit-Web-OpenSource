import styled from 'styled-components';

import ChevronLeft from '~/icons/ChevronLeft';

export const ChatMembersContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const MembersReturn = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 52px;
  padding-left: 20px;
  color: ${({ theme }) => theme.palette.neutral.shade2};
  border-bottom: 1px solid #e3e4e8;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.palette.neutral.main};
  }
`;

export const MembersArrowLeft = styled(ChevronLeft).attrs({ width: 18, height: 14 })``;

export const MembersReturnTitle = styled.span`
  padding-left: 8px;
  ${({ theme }) => theme.typography.body};
`;

export const MemberItem = styled.div`
  display: flex;
  align-items: center;
  height: 46px;
  padding: 0 24px 0 20px;
  border-bottom: 1px solid #f7f7f8;
`;

export const MemberItemInfo = styled.span`
  padding-left: 12px;
  ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const ClickableMenuItem = styled(MemberItem)`
  cursor: pointer;
  &:hover {
    background-color: #f7f7f8;
  }
`;

export const IconWrapper = styled.span`
  width: 32px;
  height: 32px;

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 20px;
  }
`;
