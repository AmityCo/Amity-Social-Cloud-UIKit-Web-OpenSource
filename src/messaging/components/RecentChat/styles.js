import styled from 'styled-components';
import { Check, Close, CreateChat } from '~/icons';

export const CreateIcon = styled(Check)`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const CloseIcon = styled(Close)`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const CreateNewChatIcon = styled(CreateChat)`
  font-size: 20px;
  cursor: pointer;
`;

export const RecentChatListHeader = styled.div`
  display: flex;
  padding-left: 8px;
  margin-bottom: 5px;
`;

export const RecentChatListContainer = styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  width: 280px;
  overflow: auto;
  padding: 28px 16px 5px 8px;

  flex-shrink: 0;
`;

export const CreationContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const CreationInput = styled.input`
  height: 34px;
  padding: 6px;
  margin: 5px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
`;

export const CreateNewChatContainer = styled.span`
  margin-left: auto;
`;
