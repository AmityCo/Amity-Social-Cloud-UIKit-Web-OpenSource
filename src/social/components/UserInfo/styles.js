import styled from 'styled-components';
import UIAvatar from '~/core/components/Avatar';
import { Pencil, Pending, Plus } from '~/icons';
import UIOptionMenu from '~/core/components/OptionMenu';

export const PlusIcon = styled(Plus)`
  font-size: 15px;
  margin-right: 8px;
`;

export const PendingIcon = styled(Pending).attrs({ height: 30, width: 20 })`
  margin-right: 8px;
`;

export const PencilIcon = styled(Pencil)`
  font-size: 15px;
  margin-right: 4px;
`;

export const Container = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
  width: 330px;
  flex-shrink: 0;
  align-self: flex-start;
  padding: 16px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const Avatar = styled(UIAvatar).attrs({
  size: 'big',
})`
  margin-right: 12px;
`;

export const ProfileName = styled.div`
  margin-top: 10px;
  ${({ theme }) => theme.typography.headline}
`;

export const Count = styled.span`
  ${({ theme }) => theme.typography.bodyBold};
  margin-right: 2px;
`;

export const ClickableCount = styled(Count)`
  &:hover {
    cursor: pointer;
  }
  margin-right: 3px;
`;

export const CountContainer = styled.div`
  display: flex;

  > *:not(:first-child) {
    margin-left: 10px;
  }
`;

export const Description = styled.div`
  margin: 8px 0 12px;
`;

export const OptionMenu = styled(UIOptionMenu)`
  margin-left: auto;
`;

export const PendingNotification = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  display: flex;
  border-radius: 4px;
  padding: 12px 20px;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;

  &:hover {
    cursor: pointer;
  }
`;

export const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 5px;
  }
`;

export const NotificationBody = styled.div`
  font-size: 12px;
`;

export const TitleEllipse = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.palette.primary.main};
`;
