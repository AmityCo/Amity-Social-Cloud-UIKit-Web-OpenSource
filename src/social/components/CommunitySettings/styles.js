import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import UICommunitySettingsTabs from '~/social/components/CommunitySettingsTabs';
import Button, { PrimaryButton } from '~/core/components/Button';
import UIAvatar from '~/core/components/Avatar';

export const CommunitySettingsTabs = styled(UICommunitySettingsTabs)``;

export const Container = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 600px;
`;

export const PageHeader = styled.div`
  display: flex;
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
  padding: 10px 10px 20px 10px;
`;

export const PageTitle = styled.div`
  font-weight: 600;
  font-size: 20px;
`;

export const Avatar = styled(UIAvatar).attrs({
  size: 'small',
})`
  margin-right: 12px;
  margin-left: 16px;
`;

export const AvatarContainer = styled.div`
  padding-top: 4px;
`;

export const ActiveTabContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 2;
`;

export const ActiveTabContainer = styled.div`
  flex: 3;
  margin-top: 12px;
`;

export const ExtraActionContainer = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: ${({ theme }) => theme.palette.system.background};
  align-self: flex-start;
  padding: 16px;
  margin-left: 36px;
  flex: 1;
`;

export const ExtraActionContainerHeader = styled.div`
  ${({ theme }) => theme.typography.title};
  line-height: 24px;
`;

export const ExtraActionContainerBody = styled.div`
  ${({ theme }) => theme.typography.body};
  line-height: 20px;
`;

export const Footer = styled.div`
  margin-top: 16px;
`;

export const ExtraActionPrimaryButton = styled(PrimaryButton)`
  padding: 10px 16px;
  justify-content: center;
  width: 100%;
`;

export const ExtraActionButton = styled(Button)`
  padding: 10px 16px;
  justify-content: center;
  width: 100%;
`;

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 15px;
  margin-right: 8px;
`;
