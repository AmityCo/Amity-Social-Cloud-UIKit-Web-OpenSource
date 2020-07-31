import styled from 'styled-components';
import UiKitAvatar from '../Avatar';

export const ChatItemContainer = styled.div`
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0;
  ${({ selected }) => selected && 'border-left: 1px solid rgba(41, 203, 114, 0.74);'}
  cursor: pointer;
  margin-top: 20px;
`;

export const Avatar = styled(UiKitAvatar)`
  margin-right: 8px;
`;

export const UnreadCount = styled.div`
  padding: 0 5px;
  height: 20px;
  color: #fff;
  font-size: 13px;
  margin-left: auto;
  background: #f9563a;
  border-radius: 20px;
`;
