import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/pro-regular-svg-icons';

import Menu from '~/core/components/Menu';

export const SearchIcon = styled(FaIcon).attrs({ icon: faSearch })`
  color: ${({ theme }) => theme.palette.base.shade2};
  padding: 0 10px;
  position: absolute;
  top: 10px;
  left: 5px;
  &.svg-inline--fa {
    width: auto;
  }
`;

export const CommunitiesSearchContainer = styled.div`
  position: relative;
  margin: 8px 0;
`;

export const CommunitiesSearchInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-left: 40px;
  background: #ffffff;
  border: 1px solid #d5d7dd;
  border-radius: 4px;
  outline: none;
`;

export const CommunitiesSearchResults = styled(Menu)`
  overflow-y: auto;
  max-height: 200px;

  &.feed-menu-search-container {
    width: 250px;
  }

  &.explore-header-search-container {
    width: 480px;
  }
`;
