import React from 'react';
import styled from 'styled-components';
import { SecondaryButton } from '../commonComponents/Button';
import UIAvatar from '../Avatar';
import UIOptions from '../commonComponents/Options';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';

export const RightIcon = styled(FaIcon).attrs({ icon: faChevronRight })`
  font-size: 16px;
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

export const CommunityName = styled.div`
  margin-top: 10px;
  ${({ theme }) => theme.typography.headline}
`;

export const Category = styled.div`
  margin-bottom: 16px;
  color: #636878;
`;

export const Count = styled.span`
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Buttons = styled.div`
  margin-left: auto;
`;
