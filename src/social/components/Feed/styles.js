import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Lock } from '~/icons';

export const FeedScrollContainer = styled(InfiniteScroll)`
  > :not(:first-child) {
    margin-top: 0.5rem;

    @media (min-width: 960px) {
      margin-top: 1rem;
    }
  }

  & .post:not(:first-child),
  & .post-wrapper:not(:first-child) {
    margin-top: 0.5rem;

    @media (min-width: 960px) {
      margin-top: 1rem;
    }
  }

  & .load-more {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;

    @media (min-width: 960px) {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
`;

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

export const LockIcon = styled(Lock).attrs({ width: 40, height: 40 })`
  fill: ${({ theme }) => theme.palette.base.shade2};
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
