import React from 'react';
import styled from 'styled-components';
import { SecondaryButton } from '../commonComponents/Button';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import UiSideMenuItem from '../commonComponents/SideMenuItem';

export const RightIcon = styled(FaIcon).attrs({ icon: faChevronRight })`
  font-size: 16px;
`;

export const Container = styled.div`
  border: 1px solid #edeef2;
  border-radius: 4px;
  background: #fff;
  max-width: 330px;
  flex-shrink: 1;
  align-self: flex-start;
`;

export const Content = styled.div`
  border-top: 1px solid #e3e4e8;
  border-bottom: 1px solid #e3e4e8;
  overflow-y: auto;
  padding: 16px;
`;

export const Header = styled.div`
  ${({ theme }) => theme.typography.title}
  padding: 16px;
`;

export const Footer = styled(SecondaryButton)`
  width: 100%;
  padding: 14px;
  border-radius: 0;
`;
