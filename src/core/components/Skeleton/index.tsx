import React from 'react';
// @ts-ignore
import ReactLoadingSkeleton from 'react-loading-skeleton';

interface SkeletonProps {
  borderRadius?: number;
  circle?: boolean;
  duration?: number;
  fontSize?: number | string;
  height?: number | string;
  primaryColor?: string;
  secondaryColor?: string;
  style?: React.CSSProperties;
  width?: number | string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  circle,
  borderRadius = 12,
  primaryColor = '#EBECEF',
  secondaryColor = '#f3f3f3',
  duration = 2,
  style,
  ...props
}) => {
  return (
    <ReactLoadingSkeleton
      {...props}
      duration={duration}
      circle={circle}
      style={{
        ...style,
        backgroundColor: primaryColor,
        backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`,
        borderRadius: circle ? undefined : borderRadius,
      }}
    />
  );
};

export default Skeleton;
