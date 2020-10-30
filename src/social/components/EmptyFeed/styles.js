import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/pro-light-svg-icons';

import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import Button from '~/core/components/Button';

export const FeedIcon = styled(FaIcon).attrs({ icon: faNewspaper })`
  font-size: 48px;
  margin: 10px;
`;

export const EmptyFeedContainer = styled.div`
  color: ${({ theme }) => theme.palette.base.shade3};
  ${({ theme }) => theme.typography.bodyBold}
  height: 220px;
  padding: 40px 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  justify-content: flex-start;
`;

export const ExploreLink = styled(Button)`
  font-size: 14px;
  margin-top: 8px;
`;

export const SearchIcon = styled(FaIcon).attrs({ icon: faSearch })`
  font-size: 16px;
  margin-right: 6px;
`;

export const Text = styled.div`
  margin-top: 8px;
`;
