import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { ChevronDown } from '~/icons';

const StyledLoadMore = styled.button`
  display: block;
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.625rem 0.75rem;
  background: none;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  color: ${({ theme }) => theme.palette.base.shade2};
  text-align: center;
`;

export default function LoadMore({ onClick }: { onClick?: () => void }) {
  return (
    <StyledLoadMore
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <FormattedMessage id="loadMore" /> <ChevronDown height=".8em" />
    </StyledLoadMore>
  );
}
