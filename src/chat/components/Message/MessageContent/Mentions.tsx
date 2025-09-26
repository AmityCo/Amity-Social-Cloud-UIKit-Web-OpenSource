import React from 'react';

import Linkify from '~/core/components/Linkify';
import styles from './Mentions.module.css';

interface TextProps {
  data: { text: string };
}

// Helper function to render text with bold mentions while preserving Linkify functionality
const renderTextWithMentions = (text: string) => {
  // Split text considering mentions only at start or after space
  const parts = text.split(/(^|\s)(@\w+)/g);

  return parts.map((part, index) => {
    if (part.startsWith('@') && part.length > 1) {
      return (
        <span key={index} className={styles.mention}>
          {part}
        </span>
      );
    }
    return <Linkify key={index}>{part}</Linkify>;
  });
};

const Mentions = ({ data }: TextProps) => {
  const { text } = data;
  // Check for mentions only at start or after space
  const hasMentions = /(^|\s)@\w+/.test(text);

  if (hasMentions) {
    return <div className={styles.textWithMentions}>{renderTextWithMentions(text)}</div>;
  }

  return (
    <div className={styles.textContent}>
      <Linkify>{text}</Linkify>
    </div>
  );
};

export default Mentions;
