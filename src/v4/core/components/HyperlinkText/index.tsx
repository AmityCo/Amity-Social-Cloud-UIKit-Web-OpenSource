import React, { ReactNode } from 'react';
import styles from './styles.module.css';

import Linkify from 'linkify-react';

const HyperLinkText = ({ children }: { children: ReactNode }) => {
  return (
    <Linkify
      options={{
        target: '_blank',
        render: ({ attributes, content }) => {
          return (
            <a className={styles.hyperlink} {...attributes}>
              {content}
            </a>
          );
        },
      }}
    >
      {children}
    </Linkify>
  );
};

export default HyperLinkText;
