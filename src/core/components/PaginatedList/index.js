import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import ChevronDown from '~/icons/ChevronDown';

import { ChevronDownContainer } from '~/core/components/PaginatedList/styles';

const DefaultContainer = styled.div``;

const LoadMore = styled.button`
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

const PaginatedList = ({
  children = (props) => JSON.stringify(props),
  items = [],
  hasMore = false,
  loadMore = () => {},
  container = DefaultContainer,
  containerProps = {},
  emptyState = null,
}) => {
  const [render] = [].concat(children);

  const onClick = (e) => {
    e.stopPropagation();
    loadMore();
  };

  const Container = container;

  return (
    <div>
      <Container {...containerProps}>
        {items.map((item) => render(item))}
        {items.length === 0 && emptyState}
      </Container>

      {hasMore && (
        <LoadMore onClick={onClick}>
          <FormattedMessage id="loadMore" />
          <ChevronDownContainer>
            <ChevronDown height={14} width={14} />
          </ChevronDownContainer>
        </LoadMore>
      )}
    </div>
  );
};

PaginatedList.propTypes = {
  container: PropTypes.elementType,
  containerProps: PropTypes.object,
  items: PropTypes.array.isRequired,
  emptyState: PropTypes.node,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  children: PropTypes.func,
};

export default PaginatedList;
