import { PostContentType } from '@amityco/ts-sdk';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import { TextWithMention } from '~/v4/social/internal-components/TextWithMention/TextWithMention';
import { Typography } from '~/v4/core/components';
import styles from './TextContent.module.css';
import { isValidUrl } from '~/v4/social/utils/isValidUrl';

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
  productTags?: Amity.TextProductTag[];
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
  productTags,
  keyword,
  isSearchPost = false,
  isOpenSeeMore = false,
}: TextContentProps) => {
  const { post: childPost } = usePost(post?.children?.[0]);

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

  const stream = useStream((childPost as Amity.Post<'liveStream'>)?.data?.streamId);

  const firstLinkWithPreview = post?.links?.find((link) => link.renderPreview);
  const canPreviewShown =
    firstLinkWithPreview && !isHasMedia && isValidUrl(firstLinkWithPreview.url);

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
            productTags={productTags}
            componentId={componentId}
            data={{ text: stream?.title ?? '' }}
          />
          {stream?.description?.trim() && (
            <TextWithMention
              pageId={pageId}
              mentionees={mentionees}
              metadata={{ mentioned, hashtagged }}
              hashtags={hashtags}
              productTags={productTags}
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
              links={post?.links}
              productTags={productTags}
              keyword={keyword}
              isSearchPost={isSearchPost}
              seeMoreIsOpen={isOpenSeeMore}
            />
          )}
        </>
      )}
      {canPreviewShown && (
        <LinkPreview pageId={pageId} componentId={componentId} url={firstLinkWithPreview.url} />
      )}
    </>
  );
};
