import React from 'react';
import InsideInputText from '~/v4/core/components/InputText/InsideInputText';
import styles from './CommentEdition.module.css';

export const CommentEditContainer = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles.commentEditContainer} {...props}>
    {children}
  </div>
);

export const CommentEditTextarea = (props: React.ComponentProps<typeof InsideInputText>) => (
  <InsideInputText rows={1} maxRows={15} className={styles.commentEditTextarea} {...props} />
);

export const ButtonContainer = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={styles.buttonContainer} {...props}>
    {children}
  </div>
);
