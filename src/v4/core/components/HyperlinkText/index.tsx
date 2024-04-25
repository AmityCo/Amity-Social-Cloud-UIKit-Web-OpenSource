import React, { ReactNode } from 'react';
import styles from './styles.module.css';

import Linkify from 'linkify-react';

const HyperLinkText = ({
  linkClassName,
  children,
}: {
  linkClassName?: string;
  children: ReactNode;
}) => {
  return (
    <Linkify
      options={{
        target: '_blank',
        render: ({ attributes, content }) => {
          return (
            <a className={linkClassName || styles.hyperlink} {...attributes}>
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
