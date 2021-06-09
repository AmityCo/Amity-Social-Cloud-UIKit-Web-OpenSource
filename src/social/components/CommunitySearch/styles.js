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

export const CommunitiesSearchInput = styled(InputAutocomplete)``;
