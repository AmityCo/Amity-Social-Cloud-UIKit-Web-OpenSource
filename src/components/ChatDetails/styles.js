import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import UiKitAvatar from 'components/Avatar';

export const Avatar = styled(UiKitAvatar)``;

export const CloseIcon = styled(FaIcon).attrs({ icon: faTimes })`
  font-size: 19px;
  cursor: pointer;
  color: #17181c;
  margin-left: auto;
`;

export const ChatDetailsHeader = styled.div`
  display: flex;
  color: #17181c;
  font-weight: 600;
  font-size: 16px;
`;

export const ChatDetailsContainer = styled.div`
  width: 280px;
  flex-shrink: 0;
  border: solid 1px #e3e4e8;
  padding: 24px 20px;
`;

export const Channel = styled.div`
  margin-top: 24px;
  display: flex;
`;

export const ChannelInfo = styled.div`
  margin-left: 12px;
`;

export const ChannelName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000000;
`;

export const CommunityName = styled.div`
  font-size: 12px;
  // color: #999999;
`;
