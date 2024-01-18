import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Lock } from '~/icons';

const feedScrollContainerCss = css`
  > :not(:first-child) {
    margin-top: 20px;
  }

  & .post:not(:first-child) {
    margin-top: 20px;
  }

  & .load-more {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

export const FeedScrollContainer = (props: React.ComponentProps<typeof InfiniteScroll>) => {
  return <InfiniteScroll {...props} className={String(feedScrollContainerCss)} />;
};

export const PrivateFeedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > * {
    margin-top: 10px;
  }

  color: ${({ theme }) => theme.palette.base.shade3};
  padding: 5rem 0.5rem;
  background: ${({ theme }) => theme.palette.system.background};
  color: ${({ theme }) => theme.palette.base.shade3};
  ${({ theme }) => theme.typography.body};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const LockIcon = styled(Lock)<{ icon?: ReactNode }>`
  font-size: 40px;
  color: ${({ theme }) => theme.palette.base.shade2};
`;

export const PrivateFeedTitle = styled.div`
  font-weight: 600;
  font-size: 17px;
  color: ${({ theme }) => theme.palette.base.main};
`;

export const PrivateFeedBody = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.base.shade1};
`;
