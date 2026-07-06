import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Typography.module.css';
import clsx from 'clsx';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

export type TypographyProps = ComponentPropsWithoutRef<TypographyElement> & {
  as?: TypographyElement;
  testId?: string;
};

export const enum TypographyVariant {
  Headline = 'headline',
  TitleBold = 'titleBold',
  Title = 'title',
  BodyBold = 'bodyBold',
  Body = 'body',
  CaptionBold = 'captionBold',
  Caption = 'caption',
  CaptionSmall = 'captionSmall',
}

export function Typography({
  as: Element = 'p',
  children,
  className,
  testId,
  ...props
}: TypographyProps) {
  return (
    <Element className={clsx(styles.typography, className)} {...props}>
      {children}
    </Element>
  );
}

Typography.Headline = function ({ as = 'h1', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__headline, className)}
      {...props}
    />
  );
};

Typography.TitleBold = function ({ as = 'h2', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__titleBold, className)}
      {...props}
    />
  );
};

Typography.Title = function ({ as = 'h2', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__title, className)}
      {...props}
    />
  );
};

Typography.BodyBold = function ({ as = 'p', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__bodyBold, className)}
      {...props}
    />
  );
};

Typography.Body = function ({ as = 'p', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__body, className)}
      {...props}
    />
  );
};

Typography.CaptionBold = function ({ as = 'span', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__captionBold, className)}
      {...props}
    />
  );
};

Typography.Caption = function ({ as = 'span', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__caption, className)}
      {...props}
    />
  );
};

Typography.CaptionSmall = function ({ as = 'span', className, testId, ...props }: TypographyProps) {
  return (
    <Typography
      as={as}
      data-testid={testId}
      className={clsx(styles.typography__captionSmall, className)}
      {...props}
    />
  );
};
