import React, { useState, useMemo, ReactNode, useEffect } from 'react';

import { Linkify } from '~/v4/social/internal-components/Linkify';
import { Mentioned, findChunks, processChunks, Mentionees } from '~/v4/helpers/utils';
import { Typography } from '~/v4/core/components';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import styles from './TextContent.module.css';
import * as linkify from 'linkifyjs';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';

interface MentionHighlightTagProps {
  children: ReactNode;
  mentionee: Mentioned;
}

const MentionHighlightTag = ({ children }: MentionHighlightTagProps) => {
  return <span className={styles.mentionHighlightTag}>{children}</span>;
};

const MAX_TEXT_LENGTH = 500;

interface TextContentProps {
  text?: string;
  mentioned?: Mentioned[];
  mentionees?: Mentionees;
}

export const TextContent = ({ text = '', mentionees = [], mentioned }: TextContentProps) => {
  if (!text) {
    return null;
  }

  const linksFounded = linkify.find(text).filter((link) => link.type === 'url');

  return (
    <>
      <TextWithMention
        data={{ text: text }}
        mentionees={mentionees}
        metadata={{
          mentioned,
        }}
      />
      {linksFounded && linksFounded.length > 0 && <LinkPreview url={linksFounded[0].href} />}
    </>
  );
};
