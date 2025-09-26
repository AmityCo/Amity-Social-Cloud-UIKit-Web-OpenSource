import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeft } from '~/v4/icons/ArrowLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import { Button } from '~/v4/core/natives/Button/Button';
import styles from './styles.module.css';

type CarouselProps = PropsWithChildren<{
  className?: string;
  isHidden?: boolean;
  scrollOffset?: number;
  iconClassName?: string;
  leftArrowClassName?: string;
  rightArrowClassName?: string;
}>;

export const Carousel = ({
  children,
  isHidden,
  className,
  iconClassName,
  leftArrowClassName,
  scrollOffset = 250,
  rightArrowClassName,
}: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isArrowLeftButtonShown, setIsArrowLeftButtonShown] = useState(false);
  const [isArrowRightButtonShown, setIsArrowRightButtonShown] = useState(false);

  const handleScroll = (scrollOffset: number) => {
    if (carouselRef.current)
      carouselRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  const scrollLeft = () => handleScroll(-scrollOffset);

  const scrollRight = () => handleScroll(scrollOffset);

  const checkScrollButtonsVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setIsScrollable(scrollWidth > clientWidth);
      setIsArrowLeftButtonShown(scrollLeft > 0);
      setIsArrowRightButtonShown(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    setTimeout(() => checkScrollButtonsVisibility(), 300);
    if (carouselRef && carouselRef.current) {
      carouselRef.current.addEventListener('scroll', checkScrollButtonsVisibility);
    }
    return () => {
      if (carouselRef.current)
        carouselRef.current.removeEventListener('scroll', checkScrollButtonsVisibility);
    };
  }, [carouselRef.current]);

  return (
    <section className={clsx(styles.carousel, className)}>
      {isScrollable && !isHidden && (
        <Button
          onPress={scrollLeft}
          className={clsx(leftArrowClassName)}
          data-shown={isArrowLeftButtonShown}
          isDisabled={!isArrowLeftButtonShown}
        >
          <ArrowLeft className={clsx(iconClassName)} />
        </Button>
      )}
      {React.cloneElement(children as React.ReactElement, { ref: carouselRef })}
      {isScrollable && !isHidden && (
        <Button
          onPress={scrollRight}
          data-shown={isArrowRightButtonShown}
          isDisabled={!isArrowRightButtonShown}
          className={clsx(rightArrowClassName)}
        >
          <ChevronRight className={clsx(iconClassName)} />
        </Button>
      )}
    </section>
  );
};
