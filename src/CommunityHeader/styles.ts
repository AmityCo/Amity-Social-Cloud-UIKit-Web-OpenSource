import styled from 'styled-components';
import UiAvatar from '../Avatar';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faCommentsAlt, faPen, faLockAlt } from '@fortawesome/pro-regular-svg-icons';

export const PrivateIcon = styled(FaIcon).attrs({ icon: faLockAlt })`
  margin-right: 8px;
  font-size: 16px;
`;

export const ChatIcon = styled(FaIcon).attrs({ icon: faCommentsAlt })`
  font-size: 16px;
`;

export const PenIcon = styled(FaIcon).attrs({ icon: faPen })`
  font-size: 16px;
  margin-right: 10px;
`;

export const CommunityHeaderContainer = styled.div`
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px 4px 0 0;
`;

export const CommunityWrapper = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
`;

export const Tabs = styled.div`
  padding: 0 16px;
`;
