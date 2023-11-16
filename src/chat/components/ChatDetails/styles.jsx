import styled from 'styled-components';

import { Close } from '~/icons';

export const ChatDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 280px;
  height: 100%;
  padding-top: 24px;
  border-left: 1px solid #e3e4e8;
`;

export const ChatDetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px 18px 20px;
  ${({ theme }) => theme.typography.title};
  line-height: 1.75;
  color: ${({ theme }) => theme.palette.neutral.shade1};
`;

// TODO IconButton
export const HeaderCloseIcon = styled(Close)`
  font-size: 20px;
  color: ${({ theme }) => theme.palette.neutral.main};
  cursor: pointer;
`;

export const ChatDetailsTitle = styled.div`
  display: flex;
  padding: 0 24px 25px 20px;
  border-bottom: 1px solid #e3e4e8;
`;

export const TitleInfo = styled.div`
  margin-left: 12px;
`;

export const TitleInfoLabel = styled.div`
  padding-bottom: 2px;
  ${({ theme }) => theme.typography.body};
  line-height: 16px;
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const TitleInfoChatName = styled.div`
  ${({ theme }) => theme.typography.bodyBold};
  line-height: 24px;
  color: #000000;
`;
