import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faSearch, faPlus } from '@fortawesome/pro-regular-svg-icons';

export const NewsIcon = styled(FaIcon).attrs({ icon: faNewspaper })`
  font-size: 20px;
`;

export const SearchIcon = styled(FaIcon).attrs({ icon: faSearch })`
  font-size: 20px;
`;

export const PlusIcon = styled(FaIcon).attrs({ icon: faPlus })`
  font-size: 20px;
`;

export const BlockTitle = styled.div`
  margin: 20px 0 20px 8px;
`;

export const SideMenuListContainer = styled.div`
  background-color: white;
  border: 1px solid #e6e6e6;
  width: 280px;
  overflow: auto;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.title}
`;

export const CommunityBlock = styled.div`
  padding: 0 16px 0 8px;
`;

export const MyCommunityBlock = styled.div`
  border-top: 1px solid #f7f7f8;
  padding: 0 16px 0 8px;
`;
