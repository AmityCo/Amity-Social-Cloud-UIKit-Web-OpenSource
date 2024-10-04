import React from 'react';
import clsx from 'clsx';
import typography from '~/v4/styles/typography.module.css';

type TypographyRenderer = ({ typoClassName }: { typoClassName: string }) => JSX.Element;

type TypographyProps =
  | {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
    }
  | { renderer: TypographyRenderer };

const isRendererProp = (props: TypographyProps): props is { renderer: TypographyRenderer } => {
  return (props as { renderer: TypographyRenderer }).renderer !== undefined;
};

export const Typography = {
  Heading: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-headings']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <h1
        className={clsx(typography['typography'], typography['typography-headings'], className)}
        style={style}
        {...rest}
      >
        {children}
      </h1>
    );
  },

  Title: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-titles']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <h2
        className={clsx(typography['typography'], typography['typography-titles'], className)}
        style={style}
        {...rest}
      >
        {children}
      </h2>
    );
  },

  Subtitle: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-sub-title']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <h3
        className={clsx(typography['typography'], typography['typography-sub-title'], className)}
        style={style}
        {...rest}
      >
        {children}
      </h3>
    );
  },

  Body: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-body']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <span
        className={clsx(typography['typography'], typography['typography-body'], className)}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  },

  BodyBold: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-body-bold']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <span
        className={clsx(typography['typography'], typography['typography-body-bold'], className)}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  },

  Caption: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-caption']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <span
        className={clsx(typography['typography'], typography['typography-caption'], className)}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  },

  CaptionBold: (props: TypographyProps) => {
    if (isRendererProp(props)) {
      return props.renderer({
        typoClassName: clsx(typography['typography'], typography['typography-caption-bold']),
      });
    }

    const { children, className, style, ...rest } = props;

    return (
      <span
        className={clsx(typography['typography'], typography['typography-caption-bold'], className)}
        style={style}
        {...rest}
      >
        {children}
      </span>
    );
  },
};

export default Typography;
