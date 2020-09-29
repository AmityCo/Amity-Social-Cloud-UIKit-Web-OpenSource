import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPencil } from '@fortawesome/pro-regular-svg-icons';

import UIAvatar from 'components/Avatar';
import UIOptions from 'components/Options';

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 15px;
  margin-right: 8px;
`;

export const PencilIcon = styled(FaIcon).attrs({ icon: faPencil })`
  font-size: 15px;
  margin-right: 4px;
`;

export const Options = styled(UIOptions)`
  margin-left: auto;
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

export const Category = styled.div`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const Count = styled.span`
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Description = styled.div`
  margin: 8px 0 12px;
`;

export const ButtonContainer = styled.div`
  padding: 12px 0;
`;
