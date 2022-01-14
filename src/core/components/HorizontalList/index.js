import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import useMeasure from 'react-use/lib/useMeasure';
import useScroll from 'react-use/lib/useScroll';
import Button from '~/core/components/Button';
import ChevronLeftIcon from '~/icons/ChevronLeft';
import ChevronRightIcon from '~/icons/ChevronRight';

const ITEM_SPACE_SIZE = 16;
const DEFAULT_COLUMN_NUMBER = {
  1024: 2,
  1280: 3,
  1440: 4,
  1800: 5,
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 16px 0;
  align-items: flex-end;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.headline};
  display: inline-block;
  margin: 0;
`;

const Pagination = styled.div`
  display: flex;
  gap: 20px;
`;

const PaginationButton = styled(Button).attrs({ variant: 'secondary' })`
  width: 28px;
  padding: 2px;

  &:hover {
    background-color: transparent;
  }

  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade3};
  }
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
`;

const StretchedList = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  grid-gap: ${ITEM_SPACE_SIZE}px;

  ${({ columns }) =>
    Object.entries(columns).map(
      ([breakpoint, column]) => `
        @media (min-width: ${breakpoint}px) {
        grid-auto-columns: calc((100% / ${column}) - (${ITEM_SPACE_SIZE}px * ${
        column - 1
      } / ${column}));
    }
  `,
    )} );
`;

const HorizontalList = ({
  title = '',
  children,
  columns = DEFAULT_COLUMN_NUMBER,
  hasMore = false,
  loadMore = () => {},
}) => {
  const containerRef = useRef(null);
  const { x: scrollPosition } = useScroll(containerRef);
  const [wrapperRef, { width }] = useMeasure();
  const [page, setPage] = useState(0);

  const contentWidth = containerRef.current?.scrollWidth ?? 0;

  const hasMultiPage = useMemo(() => contentWidth > width, [contentWidth, width]);

  const isLastPage = useMemo(
    () => scrollPosition >= contentWidth - width,
    [scrollPosition, contentWidth, width],
  );

  const isFirstPage = useMemo(() => scrollPosition === 0, [scrollPosition]);

  useEffect(
    () =>
      containerRef.current?.scrollTo({
        left: (width + ITEM_SPACE_SIZE) * page,
        behavior: 'smooth',
      }),
    [width, page],
  );

  useEffect(() => {
    if (scrollPosition >= contentWidth - width * 2 && hasMore) {
      loadMore();
    }
  }, [scrollPosition, contentWidth, width, hasMore, loadMore]);

  return (
    <div ref={wrapperRef}>
      <Header>
        <Title>{title}</Title>
        {hasMultiPage && (
          <Pagination>
            <PaginationButton disabled={isFirstPage} onClick={() => setPage(page - 1)}>
              <ChevronLeftIcon height="20px" />
            </PaginationButton>
            <PaginationButton disabled={isLastPage} onClick={() => setPage(page + 1)}>
              <ChevronRightIcon height="20px" />
            </PaginationButton>
          </Pagination>
        )}
      </Header>
      <ScrollContainer ref={containerRef} page={page}>
        <StretchedList columns={columns}>{children}</StretchedList>
      </ScrollContainer>
    </div>
  );
};

export default HorizontalList;
