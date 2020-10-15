import styled, { css } from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faBadgeCheck } from '@fortawesome/pro-solid-svg-icons';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';

export const PrivateIcon = styled(FaIcon).attrs({ icon: faLockAlt })`
  margin-right: 8px;
  font-size: 16px;
`;

export const VerifiedIcon = styled(FaIcon).attrs({ icon: faBadgeCheck })`
  margin-left: 8px;
  font-size: 16px;
  color: #1253de;
`;

export const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  ${({ theme, isActive }) => css`
    ${theme.typography.bodyBold}
    ${isActive && `color: ${theme.palette.primary.main}`}
  `}
`;
