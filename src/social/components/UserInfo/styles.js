import styled from 'styled-components';
import UIAvatar from '~/core/components/Avatar';
import UIOptionMenu from '~/core/components/OptionMenu';
import { Pencil, Pending, Plus } from '~/icons';

export const PlusIcon = styled(Plus).attrs({ width: 15, height: 15 })`
  margin-right: 8px;
`;

export const PendingIconContainer = styled.div`
  margin-right: 4px;
  display: flex;
  align-items: center;
`;

export const PendingIcon = styled(Pending).attrs({ height: 30, width: 20 })``;

export const PencilIcon = styled(Pencil).attrs({ height: 15, width: 15 })`
  margin-right: 4px;
`;

export const Container = styled.div`
  border: 1px solid #ebecef;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  flex-shrink: 0;
  align-self: flex-start;
  padding: 20px;
  margin-bottom: 14px;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const Avatar = styled(UIAvatar)`
  height: 120px;
  width: 120px;
  margin-right: auto;
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 8px;

  > button {
    min-width: 136px;
    width: 100%;
    height: 40px;
  }
`;

export const ProfileName = styled.div`
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
  margin: 8px 0;
`;

export const OptionMenu = styled(UIOptionMenu)`
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #e3e4e8;
    border-radius: 4px;
    height: 40px;
    width: 40px;

    > * {
      margin: 0;
    }
  }
`;

export const PendingNotification = styled.div`
  background: ${({ theme }) => theme.palette.base.shade4};
  display: flex;
  border-radius: 4px;
  padding: 12px 20px;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

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

export const ProfileNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const UserBadgesWrapper = styled.div`
  display: flex;

  gap: 8px;
  margin: 8px 0;
  span {
    width: max-content;
  }
`;
export const CheckIconWrapper = styled.div`
  display: flex;
`;
