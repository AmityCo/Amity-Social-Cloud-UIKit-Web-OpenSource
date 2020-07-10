import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UiKitAvatar from '../Avatar';

export const Avatar = styled(UiKitAvatar)`
  margin-top: 24px;
`;

export const DetailsIcon = styled(FaIcon).attrs({ icon: faBars })`
  font-size: 16px;
  cursor: pointer;
  color: #17181c;
  align-self: center;
`;

export const ChatHeaderContainer = styled.div`
  height: 76px;
  flex-shrink: 0;
  padding: 0 20px;
  background: #ffffff;
  border-top: 1px solid #e3e4e8;
  border-bottom: 1px solid #e3e4e8;
  display: flex;
  justify-content: space-between;
`;
