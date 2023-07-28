import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import useMeasure from 'react-use/lib/useMeasure';
import useScroll from 'react-use/lib/useScroll';
import Button from '~/core/components/Button';
import ChevronLeftIcon from '~/icons/ChevronLeft';
import ChevronRightIcon from '~/icons/ChevronRight';

import { CloseButton } from '~/core/components/ImageGallery/styles';
import { ButtonContainer } from '~/core/components/Uploaders/Image/styles';
import { Play } from '~/icons';

const ITEM_SPACE_SIZE = 16;
const DEFAULT_COLUMN_NUMBER = {
  1024: 2,
  1280: 3,
  1440: 4,
  1800: 5,
};

export const Overlay = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  z-index: 10000;
`;

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
  margin-bottom: 0.188rem; // give the shadow a little space
  display: grid;
  grid-auto-flow: column;
  /* grid-auto-columns: 100%; */
  /* grid-gap: ${ITEM_SPACE_SIZE}px; */

  /* ${({ columns }) =>
    Object.entries(columns).map(
      ([breakpoint, column]) => `
        @media (min-width: ${breakpoint}px) {
        grid-auto-columns: calc((100% / ${column}) - (${ITEM_SPACE_SIZE}px * ${
        column - 1
      } / ${column}));
    }
  `,
    )} ); */
`;

const WellnessWorkshops = ({
  title = 'Wellness workshops',
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

  const playlist = [
    {
      key: 0,
      communityId: '',
      thumbnail: '',
      title: 'Up close of our plant protein 🌱',
    },
    {
      key: 1,
      communityId: '',
      thumbnail: '',
      title: 'Its the Shilajit! 😤',
    },
    {
      key: 2,
      src: '',
      thumbnail: '',
      title: 'Cool Video 🎬',
    },
    {
      key: 3,
      communityId: '',
      thumbnail: '',
      title: 'Watch this foo 🌮',
    },
  ];

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  console.log('Video index', selectedVideoIndex);

  const spawnVideoOverlay = (index) => {
    console.log('Video index', selectedVideoIndex);
    console.log('Spawn overlay');
    setSelectedVideoIndex(index);
    document.getElementById('video-overlay').style.display = 'flex';
  };

  const closeVideoOverlay = () => {
    setSelectedVideoIndex(null);
    document.getElementById('video-overlay').style.display = 'none';
    document.getElementById(`video`).currentTime = 0;
    document.getElementById(`video`).pause();
    console.log('closing overlay');
  };

  return (
    <div className="ml-5 md:mx-0">
      <div ref={wrapperRef}>
        <Header>
          <Title>{title}</Title>
          {hasMultiPage && (
            <Pagination>
              <PaginationButton disabled={isFirstPage} onClick={() => setPage(page - 1)}>
                <ChevronLeftIcon height={20} />
              </PaginationButton>
              <PaginationButton disabled={isLastPage} onClick={() => setPage(page + 1)}>
                <ChevronRightIcon height={20} />
              </PaginationButton>
            </Pagination>
          )}
        </Header>

        <ScrollContainer ref={containerRef} page={page}>
          <StretchedList columns={columns} className="gap-[16px] md:gap-unset">
            {playlist.map((video, index) => (
              <div
                className="relative inline-table cover rounded-[5px] overflow-hidden bg-[#EBF2F1] cursor-not-allowed"
                key={video.key}
                style={{ boxShadow: `rgba(0, 0, 0, 0.05) 0px 1px 2px 0px` }}
              >
                <div
                  className="flex items-center justify-center h-[235px] w-[350px] md:w-[420px]"
                  style={{
                    backgroundImage: `url(${video.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => spawnVideoOverlay(index)} // Pass the index when the div is clicked
                >
                  <span className="!text-[28px] text-[#005850]">Coming Soon...</span>
                </div>
                <div className="bg-white p-5">
                  <h3>Workshop Name</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet arcu
                    neque neque consectetur...
                  </p>
                </div>
              </div>
            ))}
          </StretchedList>
        </ScrollContainer>
      </div>
    </div>
  );
};

export default WellnessWorkshops;
