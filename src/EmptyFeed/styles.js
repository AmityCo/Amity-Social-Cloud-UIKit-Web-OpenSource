import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/pro-light-svg-icons';

export const FeedIcon = styled(FaIcon).attrs({ icon: faNewspaper })`
  font-size: 48px;
  margin: 10px;
  cursor: pointer;
`;

export const EmptyFeedContainer = styled.div`
  color: ${({ theme }) => theme.color.base3};
  ${({ theme }) => theme.typography.bodyBold}
  width: 560px;
  padding-top: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
