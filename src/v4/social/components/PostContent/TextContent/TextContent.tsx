import React, { ReactNode } from 'react';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import styles from './TextContent.module.css';
import * as linkify from 'linkifyjs';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import usePost from '~/v4/core/hooks/objects/usePost';
import useStream from '~/v4/social/hooks/useStream';

interface MentionHighlightTagProps {
  children: ReactNode;
  mentionee: Mentioned;
}

const MentionHighlightTag = ({ children }: MentionHighlightTagProps) => {
  return <span className={styles.mentionHighlightTag}>{children}</span>;
};

const MAX_TEXT_LENGTH = 500;

interface TextContentProps {
  pageId?: string;
  componentId?: string;
  text?: string;
  mentioned?: Mentioned[];
  mentionees?: Mentionees;
  post?: Amity.Post;
}

export const TextContent = ({
  pageId = '*',
  componentId = '*',
  text = '',
  mentionees = [],
  mentioned,
  post,
}: TextContentProps) => {
  if (!text) {
    return null;
  }

  const { post: childPost } = usePost(post?.children?.[0]);

  const linksFounded = linkify.find(text).filter((link) => link.type === 'url');

  const isHasMedia =
    childPost?.dataType === 'image' ||
    childPost?.dataType === 'video' ||
    childPost?.dataType === 'poll' ||
    childPost?.dataType === 'liveStream';

  const stream = useStream(childPost?.data?.streamId);

  return (
    <>
      {childPost?.dataType === 'liveStream' ? (
        <>
          <TextWithMention
            pageId={pageId}
            mentionees={mentionees}
            metadata={{ mentioned }}
            componentId={componentId}
            data={{ text: stream?.title ?? '' }}
          />
          {stream?.description && (
            <TextWithMention
              pageId={pageId}
              mentionees={mentionees}
              metadata={{ mentioned }}
              componentId={componentId}
              data={{ text: stream.description }}
            />
          )}
        </>
      ) : (
        <TextWithMention
          pageId={pageId}
          componentId={componentId}
          data={{ text: text }}
          mentionees={mentionees}
          metadata={{ mentioned }}
        />
      )}
      {linksFounded && linksFounded.length > 0 && !isHasMedia && (
        <LinkPreview pageId={pageId} componentId={componentId} url={linksFounded[0].href} />
      )}
    </>
  );
};
