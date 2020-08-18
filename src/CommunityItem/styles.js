import styled from 'styled-components';
import UiKitAvatar from '../Avatar';
import SideMenuItem from '../commonComponents/SideMenuItem';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';

export const PrivateIcon = styled(FaIcon).attrs({ icon: faLockAlt })`
  margin-right: 8px;
  font-size: 16px;
`;

export const VervifiedIcon = styled(FaIcon).attrs({ icon: faBadgeCheck })`
  margin-left: 8px;
  font-size: 16px;
  color: #1253de;
`;

export const CommunityItemContainer = styled(SideMenuItem)``;

export const Avatar = styled(UiKitAvatar)`
  margin-right: 8px;
`;

export const CommunityName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;
