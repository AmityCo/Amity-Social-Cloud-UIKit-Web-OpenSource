import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, CompassColor, IconButton } from '@noom/wax-component-library';
import styled from 'styled-components';

import useMeasure from 'react-use/lib/useMeasure';
import useScroll from 'react-use/lib/useScroll';

const ITEM_SPACE_SIZE = 16;
const DEFAULT_COLUMN_NUMBER = {
  1024: 2,
  1280: 3,
  1440: 4,
  1800: 5,
};

const Wrap = styled.div`
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 16px 0;
  align-items: flex-end;
  flex-wrap: wrap;
  padding: 0 1rem;
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.headline};
  display: inline-block;
  margin: 0;
`;

const SubTitle = styled.div`
  ${({ theme }) => theme.typography.body};
  flex-basis: 100%;
`;

const PaginationButton = ({ onClick, left, right, ...props }) => (
  <Box
    zIndex={1}
    position="absolute"
    top={0}
    onClick={onClick}
    h="100%"
    display="flex"
    alignItems="center"
    left={left}
    right={right}
  >
    <IconButton
      boxShadow="xl"
      bg={CompassColor.offWhite}
      color={CompassColor.gold}
      borderRadius="full"
      size="lg"
      marginX={2}
      iconProps={{
        fontSize: '2.5rem',
      }}
      {...props}
    />
  </Box>
);

const ScrollContainer = styled.div`
  overflow-x: hidden;
`;

const StretchedList = styled.div`
  margin-bottom: 0.188rem; // give the shadow a little space
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
  subTitle,
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
    <Wrap ref={wrapperRef}>
      <Header>
        <Title>{title}</Title>
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
      </Header>
      <ScrollContainer ref={containerRef} page={page}>
        {hasMultiPage && (
          <>
            <PaginationButton
              left={0}
              isDisabled={isFirstPage}
              onClick={() => setPage(page - 1)}
              icon="chevron-left"
            ></PaginationButton>
            <PaginationButton
              right={0}
              isDisabled={isLastPage}
              onClick={() => setPage(page + 1)}
              icon="chevron-right"
            ></PaginationButton>
          </>
        )}
        <StretchedList columns={columns}>{children}</StretchedList>
      </ScrollContainer>
    </Wrap>
  );
};

export default HorizontalList;
