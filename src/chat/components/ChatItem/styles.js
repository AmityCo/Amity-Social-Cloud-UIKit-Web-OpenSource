import styled from 'styled-components';
import SideMenuItem from '~/core/components/SideMenuItem';
import UserAvatar from '~/chat/components/UserAvatar';

export const ChatItemContainer = styled(SideMenuItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  margin: 0;
  padding: 0 18px 0 16px;
  border-radius: 0;
`;

export const ChatItemLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled(UserAvatar)`
  flex-shrink: 0;
`;

export const Title = styled.div`
  width: 135px;
  ${({ theme }) => theme.typography.bodyBold}
  line-height: 20px;
  text-align: left;
  color: #000;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 8px;
`;

export const UnreadCount = styled.div`
  flex-shrink: 0;
  height: 20px;
  padding: 1px 6px;
  font-size: 13px;
  color: #fff;
  background: #f9563a;
  border-radius: 20px;
`;
