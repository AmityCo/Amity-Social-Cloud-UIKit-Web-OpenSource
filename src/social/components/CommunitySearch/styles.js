import styled, { css } from 'styled-components';

import InputAutocomplete from '~/core/components/InputAutocomplete';
import Search from '~/icons/Search';

export const SearchIconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

export const SearchIcon = styled(Search)`
  color: ${({ theme }) => theme.palette.base.shade2};
  font-size: 16px;
`;

export const CommunitiesSearchContainer = styled.div`
  position: relative;

  ${({ sticky }) =>
    sticky &&
    css`
      z-index: 500;
      position: sticky;
      top: 0;
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
    `}
`;

export const CommunitiesSearchInput = styled(InputAutocomplete)`
  ${({ theme }) => theme.typography.body}
  width: 100%;
  padding: 10px;
  padding-left: 40px;
  background: ${({ theme }) => theme.palette.system.background};
  border: 1px solid #d5d7dd;
  border-radius: 4px;
  outline: none;
  color: ${({ theme }) => theme.palette.base.main};

  &::placeholder {
    color: ${({ theme }) => theme.palette.base.shade1};
  }
`;
