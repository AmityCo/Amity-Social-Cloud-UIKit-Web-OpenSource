import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import ConditionalRender from '~/core/components/ConditionalRender';
import ChevronDown from '~/icons/ChevronDown';

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
      <Container>
        {items.map((item) => render(item))}
        <ConditionalRender condition={items.length === 0}>{emptyState}</ConditionalRender>
      </Container>
      <ConditionalRender condition={hasMore}>
        <LoadMore onClick={onClick}>
          <FormattedMessage id="loadMore" /> <ChevronDown height=".8em" />
        </LoadMore>
      </ConditionalRender>
    </div>
  );
};

PaginatedList.propTypes = {
  container: PropTypes.elementType,
  items: PropTypes.array.isRequired,
  emptyState: PropTypes.node,
  hasMore: PropTypes.bool,
  loadMore: PropTypes.func,
  children: PropTypes.func,
};

export default PaginatedList;
