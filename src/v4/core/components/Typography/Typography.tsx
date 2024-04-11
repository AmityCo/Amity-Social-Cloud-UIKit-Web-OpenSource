import React from 'react';
import clsx from 'clsx';

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
} = ({ children, className = '' }) => {
  return <div className={clsx('typography', className)}>{children}</div>;
};

Typography.Heading = ({ children, className = '' }) => {
  return <h1 className={clsx('typography', 'typography-headings', className)}>{children}</h1>;
};

Typography.Title = ({ children, className = '' }) => {
  return <h2 className={clsx('typography', 'typography-titles', className)}>{children}</h2>;
};

Typography.Subtitle = ({ children, className = '' }) => {
  return <h3 className={clsx('typography', 'typography-sub-title', className)}>{children}</h3>;
};

Typography.Body = ({ children, className = '' }) => {
  return <p className={clsx('typography', 'typography-body', className)}>{children}</p>;
};

Typography.BodyBold = ({ children, className = '' }) => {
  return <p className={clsx('typography', 'typography-body-bold', className)}>{children}</p>;
};

Typography.Caption = ({ children, className = '' }) => {
  return <p className={clsx('typography', 'typography-caption', className)}>{children}</p>;
};

Typography.CaptionBold = ({ children, className = '' }) => {
  return <p className={clsx('typography', 'typography-caption-bold', className)}>{children}</p>;
};

export default Typography;
