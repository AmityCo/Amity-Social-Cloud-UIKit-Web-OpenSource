import React from 'react';
import { LinkIcon } from '~/v4/social/icons';
import styles from './HyperLink.module.css';

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const HyperLink: React.FC<LinkButtonProps> = ({ href, children, ...rest }) => {
  return (
    <a href={href} className={styles.hyperlink} {...rest}>
      <LinkIcon className={styles.hyperlinkIcon} />
      <div className={styles.hyperlinkText}>
        <span className={styles.text}>{children}</span>
      </div>
    </a>
  );
};
