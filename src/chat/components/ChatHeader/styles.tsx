import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';

export const DetailsIcon = styled(FaIcon).attrs<{ icon?: ReactNode }>({
  icon: faBars,
  width: 16,
  height: 16,
})`
  font-size: 16px;
  cursor: pointer;
  fill: ${({ theme }) => theme.palette.neutral.main};
  align-self: center;
`;

export const ChatHeaderContainer = styled.div`
  height: 76px;
  padding: 0 20px;
  background: ${({ theme }) => theme.palette.system.background};
  border-top: 1px solid #e3e4e8;
  border-bottom: 1px solid #e3e4e8;
  display: flex;
  justify-content: space-between;
`;

export const Channel = styled.div`
  display: flex;
  align-items: center;
  height: 74px;
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
