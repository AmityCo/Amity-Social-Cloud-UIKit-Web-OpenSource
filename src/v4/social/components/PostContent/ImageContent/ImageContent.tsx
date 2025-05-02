import React, { useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { formatAltText } from '~/v4/social/utils';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import styles from './ImageContent.module.css';

type ImageContentProps = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
  post: Amity.Post<'image'>;
  onImageClick: (imageIndex: number) => void;
};

export const ImageContent = ({
  post,
  pageId = '*',
  onImageClick,
  elementId = '*',
  componentId = '*',
}: ImageContentProps) => {
  const { post: childPost, isLoading } = usePost(post.children?.[0]);
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const first4Images = post.children.slice(0, 4);
  const imageLeftCount = Math.max(0, post.children.length - 4);

  if (isLoading || childPost?.dataType !== 'image') return null;

  return (
    <div
      style={themeStyles}
      className={styles.imageContent}
      data-images-amount={Math.min(post.children.length, 4)}
    >
      {first4Images.map((postId: string, index: number) => (
        <Image
          key={postId}
          index={index}
          postId={postId}
          pageId={pageId}
          componentId={componentId}
          imageLeftCount={imageLeftCount}
          totalCount={post.children.length}
          onImageClick={() => onImageClick(index)}
          isLastImage={index === first4Images.length - 1}
        />
      ))}
    </div>
  );
};

type ImageProps = {
  index: number;
  postId: string;
  pageId?: string;
  totalCount: number;
  componentId?: string;
  isLastImage: boolean;
  imageLeftCount: number;
  onImageClick: () => void;
};

function Image({
  index,
  postId,
  isLastImage,
  totalCount,
  pageId = '*',
  onImageClick,
  imageLeftCount,
  componentId = '*',
}: ImageProps) {
  const { post: imagePost, isLoading } = usePost(postId);
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const file = imagePost?.getImageInfo();

  if (isLoading) return null;

  return (
    <Button
      onPress={() => onImageClick()}
      className={styles.imageContent__imgContainer}
      data-testid={`${pageId}/${componentId}/post_image`}
      aria-label={formatAltText({
        isLastImage,
        total: totalCount,
        current: index + 1,
        altText: file?.altText,
        leftCount: imageLeftCount + 1,
      })}
    >
      {file && file.fileUrl && !isBrokenImg ? (
        <img
          loading="lazy"
          onError={() => setIsBrokenImg(true)}
          className={styles.imageContent__img}
          src={getFileUrlWithSize(file.fileUrl)}
          alt={formatAltText({
            isLastImage,
            total: totalCount,
            current: index + 1,
            altText: file?.altText,
            leftCount: imageLeftCount + 1,
          })}
        />
      ) : (
        <div className={styles.imageContent__brokenImage} />
      )}
      {imageLeftCount > 0 && isLastImage && (
        <Typography.Headline className={styles.imageContent__imgCover}>
          + {imageLeftCount + 1}
        </Typography.Headline>
      )}
    </Button>
  );
}
