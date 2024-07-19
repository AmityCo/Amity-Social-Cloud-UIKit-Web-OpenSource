import React from 'react';
import Linkify from 'linkify-react';

import styles from './Linkify.module.css';

type UiKitLinkifyProps = Omit<React.ComponentProps<typeof Linkify>, 'componentDecorator'>;

export const UiKitLinkify = (props: UiKitLinkifyProps) => (
  <Linkify
    options={{
      render: ({ attributes, content }) => {
        const { href, ...props } = attributes;
        return (
          <a className={styles.link} target="blank" rel="noopener noreferrer" href={href}>
            {content}
          </a>
        );
      },
    }}
  />
);
