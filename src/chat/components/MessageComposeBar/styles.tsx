import { ReactNode } from 'react';
import styled from 'styled-components';
import { FileAttachment, ImageAttachment, SendMessage } from '~/icons';

export const SendMessageIcon = styled(SendMessage)<{ icon?: ReactNode }>`
  font-size: 28px;
  cursor: pointer;
  margin-left: 12px;
  margin-right: 8px;
  color: #0f86fe;
`;

export const ImageMessageIcon = styled(ImageAttachment)`
  font-size: 18px;
  cursor: pointer;
  margin-right: 20px;
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const FileMessageIcon = styled(FileAttachment)`
  font-size: 18px;
  margin-right: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.palette.neutral.main};
`;

export const MessageComposeBarContainer = styled.div`
  padding: 12px 16px 16px 16px;
  background: ${({ theme }) => theme.palette.system.background};
  border-top: 1px solid #e3e4e8;
  display: flex;
  align-items: center;
`;

export const MessageComposeBarInput = styled.input`
  height: 34px;
  padding: 6px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
  flex-grow: 1;
`;
