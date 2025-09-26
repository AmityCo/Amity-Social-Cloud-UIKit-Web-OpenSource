import cx from 'clsx';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import UIOptionMenu from '~/core/components/OptionMenu';
import Skeleton from '~/core/components/Skeleton';

export const OptionButtonContainer = styled.div`
  display: flex;
  align-items: center;

  position: relative;
`;

export const OptionMenuContainer = styled.div`
  position: absolute;
`;

export const OptionMenu = styled(UIOptionMenu)<{ icon?: ReactNode }>`
  margin-left: auto;
`;

const PlainPostContainer = ({
  className,
  ...props
}: {
  className?: string;
  children?: ReactNode;
}) => <div className={cx('post', className)} {...props} />;

export const PostContainer = styled(PlainPostContainer)`
  padding: 16px;
  padding-bottom: 8px;
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #edeef2;
  border-radius: 4px;
  margin-bottom: 12px;
`;

export const PostHeadContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
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

export const ContentSkeleton = () => {
  return (
    <>
      <div>
        <Skeleton style={{ fontSize: 8, maxWidth: 374 }} />
      </div>
      <div>
        <Skeleton style={{ fontSize: 8, maxWidth: 448 }} />
      </div>
      <div style={{ paddingBottom: 50 }}>
        <Skeleton style={{ fontSize: 8, maxWidth: 279 }} />
      </div>
    </>
  );
};
