import React from 'react';
import clsx from 'clsx';
import typography from '~/v4/styles/typography.module.css';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

const Typography: React.FC<TypographyProps> & {
  Heading: React.FC<TypographyProps>;
  Title: React.FC<TypographyProps>;
  Subtitle: React.FC<TypographyProps>;
  Body: React.FC<TypographyProps>;
  BodyBold: React.FC<TypographyProps>;
  Caption: React.FC<TypographyProps>;
  CaptionBold: React.FC<TypographyProps>;
} = ({ children, className = '', ...props }) => {
  return (
    <div {...props} className={clsx(typography['typography'], className)}>
      {children}
    </div>
  );
};

Typography.Heading = ({ children, className = '', ...props }) => {
  return (
    <h1
      {...props}
      className={clsx(typography['typography'], typography['typography-headings'], className)}
    >
      {children}
    </h1>
  );
};

Typography.Title = ({ children, className = '', ...props }) => {
  return (
    <h2
      {...props}
      className={clsx(typography['typography'], typography['typography-titles'], className)}
    >
      {children}
    </h2>
  );
};

Typography.Subtitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      {...props}
      className={clsx(typography['typography'], typography['typography-sub-title'], className)}
    >
      {children}
    </h3>
  );
};

Typography.Body = ({ children, className = '', ...props }) => {
  return (
    <p
      {...props}
      className={clsx(typography['typography'], typography['typography-body'], className)}
    >
      {children}
    </p>
  );
};

Typography.BodyBold = ({ children, className = '', ...props }) => {
  return (
    <p
      {...props}
      className={clsx(typography['typography'], typography['typography-body-bold'], className)}
    >
      {children}
    </p>
  );
};

Typography.Caption = ({ children, className = '', ...props }) => {
  return (
    <p
      {...props}
      className={clsx(typography['typography'], typography['typography-caption'], className)}
    >
      {children}
    </p>
  );
};

Typography.CaptionBold = ({ children, className = '', ...props }) => {
  return (
    <p
      {...props}
      className={clsx(typography['typography'], typography['typography-caption-bold'], className)}
    >
      {children}
    </p>
  );
};

export default Typography;
