import cx from 'classnames';
import React from 'react';
import styled from 'styled-components';
import UIOptionMenu from '~/core/components/OptionMenu';

export const OptionMenu = styled(UIOptionMenu)`
  margin-left: auto;
`;

export const PostContainer = styled(({ className, ...props }) => (
  <div className={cx('post', className)} {...props} />
))`
  padding: 16px;
  padding-bottom: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #edeef2;
  border-radius: 4px;
`;

export const PostHeadContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`;
