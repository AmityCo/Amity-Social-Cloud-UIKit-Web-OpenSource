import React from 'react';
import styles from './CommunityRowImage.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Img } from '~/v4/core/natives/Img/Img';

const PlaceholderImage = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="81" height="80" viewBox="0 0 81 80" fill="none">
      <g clipPath="url(#clip0_7036_40403)">
        <rect x="0.449219" width="80" height="80" rx="4" fill="#A5A9B5" />
        <path
          d="M40.449 28.8C41.9151 28.8 43.3213 29.3697 44.358 30.3837C45.3947 31.3977 45.9772 32.7729 45.9772 34.2069C45.9772 35.6409 45.3947 37.0162 44.358 38.0302C43.3213 39.0442 41.9151 39.6138 40.449 39.6138C38.9828 39.6138 37.5767 39.0442 36.5399 38.0302C35.5032 37.0162 34.9208 35.6409 34.9208 34.2069C34.9208 32.7729 35.5032 31.3977 36.5399 30.3837C37.5767 29.3697 38.9828 28.8 40.449 28.8ZM29.3926 32.6621C30.2771 32.6621 31.0984 32.8938 31.8092 33.3109C31.5722 35.52 32.2356 37.7137 33.594 39.4285C32.8042 40.9115 31.2248 41.9311 29.3926 41.9311C28.1358 41.9311 26.9306 41.4428 26.042 40.5737C25.1533 39.7045 24.6541 38.5257 24.6541 37.2966C24.6541 36.0675 25.1533 34.8887 26.042 34.0195C26.9306 33.1504 28.1358 32.6621 29.3926 32.6621ZM51.5054 32.6621C52.7621 32.6621 53.9673 33.1504 54.856 34.0195C55.7446 34.8887 56.2438 36.0675 56.2438 37.2966C56.2438 38.5257 55.7446 39.7045 54.856 40.5737C53.9673 41.4428 52.7621 41.9311 51.5054 41.9311C49.6732 41.9311 48.0937 40.9115 47.3039 39.4285C48.6623 37.7137 49.3257 35.52 49.0888 33.3109C49.7995 32.8938 50.6209 32.6621 51.5054 32.6621ZM30.1823 48.4966C30.1823 45.2988 34.7786 42.7035 40.449 42.7035C46.1193 42.7035 50.7156 45.2988 50.7156 48.4966V51.2H30.1823V48.4966ZM21.4951 51.2V48.8828C21.4951 46.7355 24.4803 44.928 28.5238 44.4028C27.5919 45.4533 27.0233 46.9054 27.0233 48.4966V51.2H21.4951ZM59.4028 51.2H53.8746V48.4966C53.8746 46.9054 53.306 45.4533 52.3741 44.4028C56.4176 44.928 59.4028 46.7355 59.4028 48.8828V51.2Z"
          fill="white"
        />
        <rect x="0.449219" width="80" height="80" fill="url(#paint0_linear_7036_40403)" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_7036_40403"
          x1="40.4492"
          y1="40"
          x2="40.4492"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopOpacity="0" />
          <stop offset="1" stopOpacity="0.4" />
        </linearGradient>
        <clipPath id="clip0_7036_40403">
          <rect x="0.449219" width="80" height="80" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface CommunityRowImageProps {
  pageId?: string;
  componentId?: string;
  imgSrc?: string;
}

export const CommunityRowImage: React.FC<CommunityRowImageProps> = ({
  pageId = '*',
  componentId = '*',
  imgSrc,
}) => {
  const elementId = 'community_row_image';

  const { themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Img
      style={themeStyles}
      className={styles.communityRowImage__img}
      src={imgSrc}
      fallBackRenderer={() => <PlaceholderImage />}
    />
  );
};
