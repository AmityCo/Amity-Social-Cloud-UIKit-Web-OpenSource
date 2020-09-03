import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import UiKitAvatar from '../Avatar';

export const Avatar = styled(UiKitAvatar)``;

export const DetailsIcon = styled(FaIcon).attrs({ icon: faBars })`
  font-size: 16px;
  cursor: pointer;
  color: #17181c;
  align-self: center;
`;

export const ChatHeaderContainer = styled.div`
  height: 76px;
  padding: 0 20px;
  background: #ffffff;
  border-top: 1px solid #e3e4e8;
  border-bottom: 1px solid #e3e4e8;
  display: flex;
  justify-content: space-between;
`;

export const Channel = styled.div`
  margin-top: 24px;
  display: flex;
`;

export const ChannelInfo = styled.div`
  margin-left: 8px;
`;

export const ChannelName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000000;
`;

export const MemberCount = styled.div`
  font-size: 12px;
  color: #999999;
`;
