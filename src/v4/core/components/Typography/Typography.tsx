import React from 'react';
import clsx from 'clsx';
import typography from '~/v4/styles/typography.module.css';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Typography: React.FC<TypographyProps> & {
  Heading: React.FC<TypographyProps>;
  Title: React.FC<TypographyProps>;
  Subtitle: React.FC<TypographyProps>;
  Body: React.FC<TypographyProps>;
  BodyBold: React.FC<TypographyProps>;
  Caption: React.FC<TypographyProps>;
  CaptionBold: React.FC<TypographyProps>;
} = ({ children, className = '', style, ...rest }) => {
  return (
    <div className={clsx(typography['typography'], className)} style={style} {...rest}>
      {children}
    </div>
  );
};

Typography.Heading = ({ children, className = '', style, ...rest }) => {
  return (
    <h1
      className={clsx(typography['typography'], typography['typography-headings'], className)}
      style={style}
      {...rest}
    >
      {children}
    </h1>
  );
};

Typography.Title = ({ children, className = '', style, ...rest }) => {
  return (
    <h2
      className={clsx(typography['typography'], typography['typography-titles'], className)}
      style={style}
      {...rest}
    >
      {children}
    </h2>
  );
};

Typography.Subtitle = ({ children, className = '', style, ...rest }) => {
  return (
    <h3
      className={clsx(typography['typography'], typography['typography-sub-title'], className)}
      style={style}
      {...rest}
    >
      {children}
    </h3>
  );
};

Typography.Body = ({ children, className = '', style, ...rest }) => {
  return (
    <span
      className={clsx(typography['typography'], typography['typography-body'], className)}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
};

Typography.BodyBold = ({ children, className = '', style, ...rest }) => {
  return (
    <span
      className={clsx(typography['typography'], typography['typography-body-bold'], className)}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
};

Typography.Caption = ({ children, className = '', style, ...rest }) => {
  return (
    <span
      className={clsx(typography['typography'], typography['typography-caption'], className)}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
};

Typography.CaptionBold = ({ children, className = '', style, ...rest }) => {
  return (
    <span
      className={clsx(typography['typography'], typography['typography-caption-bold'], className)}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Typography;
