import React from 'react';
import styles from './CategoryImage.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Img } from '~/v4/core/natives/Img/Img';

const CategoryImagePlaceHolder = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    className={className}
  >
    <rect width="28" height="28" rx="14" className={styles.categoryImage__placeHolderRect} />
    <path
      d="M19.6 14.7C19.6 14.3281 19.2719 14 18.9 14H15.4C15.0063 14 14.7 14.3281 14.7 14.7V18.2C14.7 18.5938 15.0063 18.9 15.4 18.9H18.9C19.2719 18.9 19.6 18.5938 19.6 18.2V14.7ZM9.8 13.3C8.24688 13.3 7 14.5688 7 16.1C7 17.6531 8.24688 18.9 9.8 18.9C11.3313 18.9 12.6 17.6531 12.6 16.1C12.6 14.5688 11.3313 13.3 9.8 13.3ZM18.8781 11.9C19.425 11.9 19.775 11.3313 19.4906 10.85L17.4125 7.35002C17.1281 6.89065 16.45 6.89065 16.1656 7.35002L14.0875 10.85C13.8031 11.3313 14.1531 11.9 14.7 11.9H18.8781Z"
      className={styles.categoryImage__placeHolderPath}
    />
  </svg>
);

interface CategoryImageProps {
  pageId: string;
  componentId?: string;
  elementId?: string;
  imgSrc?: string;
  className?: string;
}

export const CategoryImage = ({
  imgSrc,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  className,
}: CategoryImageProps) => {
  const { themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Img
      style={themeStyles}
      className={className}
      src={imgSrc}
      fallBackRenderer={() => <CategoryImagePlaceHolder className={className} />}
    />
  );
};
