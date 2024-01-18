import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import useMeasure from 'react-use/lib/useMeasure';
import useScroll from 'react-use/lib/useScroll';
import Button from '~/core/components/Button';
import ChevronLeftIcon from '~/icons/ChevronLeft';
import ChevronRightIcon from '~/icons/ChevronRight';

const ITEM_SPACE_SIZE = 16;
const DEFAULT_COLUMN_NUMBER = {
  720: 1,
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

const ScrollContainer = styled.div<{ page?: number }>`
  overflow-x: hidden;
`;

function findColumnByWidth(width: number, columns: { [width: number]: number }) {
  const sortedColumns = Object.entries(columns).sort(
    ([breakpointA], [breakpointB]) => Number(breakpointA) - Number(breakpointB),
  );

  const founded = sortedColumns.find(([breakpoint]) => width <= Number(breakpoint));

  if (!founded) {
    return 3;
  }

  return founded[1];
}

const StretchedList = styled.div<{ currentWidth: number; columns: { [width: number]: number } }>`
  margin-bottom: 0.188rem; // give the shadow a little space
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  grid-gap: ${ITEM_SPACE_SIZE}px;

  ${({ currentWidth, columns }) => {
    const column = findColumnByWidth(currentWidth, columns);
    return css`
      grid-auto-columns: calc(
        (100% / ${column}) - (${ITEM_SPACE_SIZE}px * ${column - 1} / ${column})
      );
    `;
  }}
`;

interface HorizontalListProps {
  title?: ReactNode;
  children: ReactNode;
  columns?: Record<number, number>;
  hasMore?: boolean;
  loadMore?: () => void;
}

const HorizontalList = ({
  title = '',
  children,
  columns = DEFAULT_COLUMN_NUMBER,
  hasMore = false,
  loadMore = () => {},
}: HorizontalListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x: scrollPosition } = useScroll(containerRef);
  const [wrapperRef, { width }] = useMeasure<HTMLDivElement>();
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
        {containerRef.current ? (
          <StretchedList currentWidth={containerRef.current.clientWidth} columns={columns}>
            {children}
          </StretchedList>
        ) : null}
      </ScrollContainer>
    </div>
  );
};

export default HorizontalList;
