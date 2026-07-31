import clsx from 'clsx';
import { ComponentPropsWithoutRef } from 'react';
import styles from './Skeleton.module.css';

type SkeletonProps = ComponentPropsWithoutRef<'div'>;

type SkeletonItemProps = React.HTMLAttributes<HTMLDivElement> & {
  width: `${number}px` | `${number}%` | `${number}rem`;
  height: `${number}px` | `${number}%` | `${number}rem`;
  radius?: `${number}px` | `${number}%` | `${number}rem` | string;
  bottom?: `${number}px` | `${number}%` | `${number}rem`;
};

export function Skeleton({ ...props }: SkeletonProps) {
  return <div {...props} />;
}

function Square({ width, height, radius, bottom, className, ...props }: SkeletonItemProps) {
  return (
    <div
      style={{ width, height, borderRadius: radius, marginBottom: bottom }}
      className={clsx(styles.skeleton__square, className)}
      {...props}
    />
  );
}

function Circle({ width, height, bottom, className, ...props }: Omit<SkeletonItemProps, 'radius'>) {
  return (
    <div
      style={{ width, height, marginBottom: bottom }}
      className={clsx(styles.skeleton__circle, className)}
      {...props}
    />
  );
}

function Line({ width, height, className, bottom, ...props }: SkeletonItemProps) {
  return (
    <div
      style={{ width, height, marginBottom: bottom }}
      className={clsx(styles.skeleton__line, className)}
      {...props}
    />
  );
}

Skeleton.Square = Square;

Skeleton.Circle = Circle;

Skeleton.Line = Line;
