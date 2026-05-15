import React from 'react';
import { useString } from '~/v4/core/localization';
import styles from './Featured.module.css';

interface FeaturedIconProps extends React.SVGProps<SVGSVGElement> {
  backgroundColor?: string;
  textColor?: string;
}

export const FeaturedIcon = ({ backgroundColor, textColor, ...props }: FeaturedIconProps) => {
  return (
    <svg
      width="73"
      height="26"
      viewBox="0 0 73 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 0H69C71.2091 0 73 1.79086 73 4V22C73 24.2091 71.2091 26 69 26H0V0Z"
        className={styles.featuredIcon__background}
        fill={backgroundColor}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className={styles.featuredIcon__textColor}
        fill={textColor}
        fontSize="11"
        fontWeight="bold"
      >
        {useString('amity_social_button_featured')}
      </text>
    </svg>
  );
};
