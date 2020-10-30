import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faCommentsAlt } from '@fortawesome/pro-regular-svg-icons';

import UIAvatar from '~/core/components/Avatar';

export const MessageIcon = styled(FaIcon).attrs({ icon: faCommentsAlt })`
  font-size: 15px;
  margin-right: 8px;
`;

export const PencilIcon = styled(FaIcon).attrs({ icon: faPencil })`
  font-size: 15px;
  margin-right: 4px;
`;

export const Container = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: #fff;
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
  ${({ theme }) => theme.typography.bodyBold}
`;

export const CountContainer = styled.div`
  > *:not(:last-child) {
    margin-right: 8px;
  }
`;

export const Description = styled.div`
  margin: 8px 0 12px;
`;
