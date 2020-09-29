import styled from 'styled-components';
import SideMenuItem from '~/core/components/SideMenuItem';
import UiKitAvatar from '~/core/components/Avatar';

export const ChatItemContainer = styled(SideMenuItem)``;

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
