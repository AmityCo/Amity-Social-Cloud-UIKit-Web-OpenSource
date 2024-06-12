import React from 'react';
import Linkify from 'linkify-react';

import styles from './Linkify.module.css';

type UiKitLinkifyProps = Omit<React.ComponentProps<typeof Linkify>, 'componentDecorator'>;

export const UiKitLinkify = (props: UiKitLinkifyProps) => (
  <Linkify
    componentDecorator={(decoratedHref?: string, decoratedText?: string, key?: string) => (
      <a
        className={styles.link}
        key={key}
        target="blank"
        rel="noopener noreferrer"
        href={decoratedHref}
      >
        {decoratedText}
      </a>
    )}
    {...props}
  />
);
