import React from 'react';
import * as linkify from 'linkifyjs';
import { PostContentType } from '@amityco/ts-sdk';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import { Typography } from '~/v4/core/components';
import styles from './TextContent.module.css';

type TextContentProps = {
  title?: string;
  text?: string;
  pageId?: string;
  post?: Amity.Post;
  componentId?: string;
  mentioned?: Mentioned[];
  mentionees?: Mentionees;
  hashtagged?: Amity.Hashtag[];
  hashtags?: string[];
  keyword?: string;
  isSearchPost?: boolean;
  isOpenSeeMore?: boolean;
};

export const TextContent = ({
  post,
  text = '',
  mentioned,
  title = '',
  pageId = '*',
  componentId = '*',
  mentionees = [],
  hashtagged,
  hashtags = [],
  keyword,
  isSearchPost = false,
  isOpenSeeMore = false,
}: TextContentProps) => {
  const { post: childPost } = usePost(post?.children?.[0]);

  const linksFounded = linkify.find(text).filter((link) => link.type === 'url');

  const isHasMedia =
    post?.children?.[0] &&
    [
      PostContentType.IMAGE,
      PostContentType.VIDEO,
      PostContentType.POLL,
      PostContentType.LIVESTREAM,
      PostContentType.CLIP,
      PostContentType.ROOM,
    ].includes(childPost?.dataType);

  const canPreviewShown = linksFounded && linksFounded.length > 0 && !isHasMedia;

  const stream = useStream((childPost as Amity.Post<'liveStream'>)?.data?.streamId);

  return (
    <>
      {childPost?.dataType === PostContentType.LIVESTREAM ? (
        <>
          <TextWithMention
            isBold
            pageId={pageId}
            mentionees={mentionees}
            metadata={{ mentioned, hashtagged }}
            hashtags={hashtags}
            componentId={componentId}
            data={{ text: stream?.title ?? '' }}
          />
          {stream?.description?.trim() && (
            <TextWithMention
              pageId={pageId}
              mentionees={mentionees}
              metadata={{ mentioned, hashtagged }}
              hashtags={hashtags}
              componentId={componentId}
              data={{ text: stream.description }}
            />
          )}
        </>
      ) : (
        <>
          {title && (
            <Typography.TitleBold
              data-testid="poll-post-title"
              className={styles.textContent__postTitle}
            >
              {title}
            </Typography.TitleBold>
          )}
          {text && (
            <TextWithMention
              pageId={pageId}
              componentId={componentId}
              data-testid="poll-post-question"
              data={{ text: text }}
              mentionees={mentionees}
              metadata={{ mentioned, hashtagged }}
              hashtags={hashtags}
              keyword={keyword}
              isSearchPost={isSearchPost}
              seeMoreIsOpen={isOpenSeeMore}
            />
          )}
        </>
      )}
      {canPreviewShown && (
        <LinkPreview pageId={pageId} componentId={componentId} url={linksFounded[0].href} />
      )}
    </>
  );
};
