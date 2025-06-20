import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Typography.module.css';
import clsx from 'clsx';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export type TypographyProps = ComponentPropsWithoutRef<TypographyElement> & {
  as?: TypographyElement;
};

export function Typography({ as: Element = 'p', children, className, ...props }: TypographyProps) {
  return (
    <Element className={clsx(styles.typography, className)} {...props}>
      {children}
    </Element>
  );
}

Typography.Headline = function ({ as = 'h1', className, ...props }: TypographyProps) {
  return <Typography as={as} className={clsx(styles.typography__headline, className)} {...props} />;
};

Typography.TitleBold = function ({ as = 'h2', className, ...props }: TypographyProps) {
  return (
    <Typography as={as} className={clsx(styles.typography__titleBold, className)} {...props} />
  );
};

Typography.Title = function ({ as = 'h2', className, ...props }: TypographyProps) {
  return <Typography as={as} className={clsx(styles.typography__title, className)} {...props} />;
};

Typography.BodyBold = function ({ as = 'p', className, ...props }: TypographyProps) {
  return <Typography as={as} className={clsx(styles.typography__bodyBold, className)} {...props} />;
};

Typography.Body = function ({ as = 'p', className, ...props }: TypographyProps) {
  return <Typography as={as} className={clsx(styles.typography__body, className)} {...props} />;
};

Typography.CaptionBold = function ({ as = 'span', className, ...props }: TypographyProps) {
  return (
    <Typography as={as} className={clsx(styles.typography__captionBold, className)} {...props} />
  );
};

Typography.Caption = function ({ as = 'span', className, ...props }: TypographyProps) {
  return <Typography as={as} className={clsx(styles.typography__caption, className)} {...props} />;
};

Typography.CaptionSmall = function ({ as = 'span', className, ...props }: TypographyProps) {
  return (
    <Typography as={as} className={clsx(styles.typography__captionSmall, className)} {...props} />
  );
};
