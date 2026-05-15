import clsx from 'clsx';
import React, { ComponentProps } from 'react';
import { EmptyResultIcon, EmptyResultTitle } from '~/v4/social/elements';
import styles from './EmptyResult.module.css';

type EmptyResultProps = ComponentProps<'div'> & {
  pageId?: string;
  componentId?: string;
  textId?: string;
};

export const EmptyResult = ({
  className,
  pageId = '*',
  componentId = '*',
  textId,
  ...props
}: EmptyResultProps) => {
  return (
    <div {...props} className={clsx(styles.emptyResult, className)}>
      <EmptyResultIcon pageId={pageId} componentId={componentId} />
      <EmptyResultTitle pageId={pageId} componentId={componentId} textId={textId} />
    </div>
  );
};
