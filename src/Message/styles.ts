import styled from 'styled-components';
import UiKitAvatar from '../Avatar';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export const MessageOptionsIcon = styled(FaIcon).attrs({ icon: faEllipsisV })`
  opacity: 0.5;
  font-size: 11px;
  padding: 0 5px;
  cursor: pointer;
`;

export const Avatar = styled(UiKitAvatar)`
  margin: 0 12px 0 auto;
`;

export const MessageWrapper = styled.div`
  display: flex;
  max-width: 60%;
  min-width: 60px;
  ${({ incoming }) => !incoming && 'align-self: flex-end;'}
`;

export const MessageContainer = styled.div``;

export const AvatarWrapper = styled.div`
  width: 72px;
`;

export const UserName = styled.div`
  color: #17181c;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const MessageBody = styled.div`
  text-align: left;
  padding: 8px;
  margin-bottom: 8px;

  display: flex;
  flex-direction: column;
  ${({ incoming }) =>
    incoming
      ? `
  background: #e3e4e8;
  border-radius: 0px 6px 6px 6px;
`
      : `
  background: #1054DE;
  color: #fff;
  border-radius: 6px 0px 6px 6px;
`}
`;

export const MessageDate = styled.div`
  font-size: 13px;
  opacity: 0.5;
  margin-left: auto;
`;

export const BottomLine = styled.div`
  margin-top: 3px;
  display: flex;
  align-items: center;
`;
