import React from 'react';
import * as linkify from 'linkifyjs';
import { PostContentType } from '@amityco/ts-sdk';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';

type TextContentProps = {
  text?: string;
  pageId?: string;
  post?: Amity.Post;
  componentId?: string;
  mentioned?: Mentioned[];
  mentionees?: Mentionees;
};

export const TextContent = ({
  post,
  text = '',
  mentioned,
  pageId = '*',
  componentId = '*',
  mentionees = [],
}: TextContentProps) => {
  if (!text) return null;

  const { post: childPost } = usePost(post?.children?.[0]);

  const linksFounded = linkify.find(text).filter((link) => link.type === 'url');

  const isHasMedia =
    post?.children?.[0] &&
    [
      PostContentType.IMAGE,
      PostContentType.VIDEO,
      PostContentType.POLL,
      PostContentType.LIVESTREAM,
    ].includes(childPost?.dataType);

  const canPreviewShown = linksFounded && linksFounded.length > 0 && !isHasMedia;

  const stream = useStream(childPost?.data?.streamId);

  return (
    <>
      {childPost?.dataType === PostContentType.LIVESTREAM ? (
        <>
          <TextWithMention
            isBold
            pageId={pageId}
            mentionees={mentionees}
            metadata={{ mentioned }}
            componentId={componentId}
            data={{ text: stream?.title ?? '' }}
          />
          {stream?.description?.trim() && (
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
      {canPreviewShown && (
        <LinkPreview pageId={pageId} componentId={componentId} url={linksFounded[0].href} />
      )}
    </>
  );
};
