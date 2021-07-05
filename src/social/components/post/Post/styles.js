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

export const ReviewButtonsContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  margin-top: 6px;
  padding-top: 12px;
  display: flex;

  > * {
    flex: 1 1 0;

    &:not(:first-child) {
      margin-left: 12px;
    }
  }
`;
