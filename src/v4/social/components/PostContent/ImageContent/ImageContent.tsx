import React, { useEffect, useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './ImageContent.module.css';

const ImageThumbnail = ({
  fileId,
  placeholder,
}: {
  fileId: string;
  placeholder: React.ReactNode;
}) => {
  const imageUrl = useImage({ fileId });

  return (
    <>
      {!imageUrl ? (
        placeholder
      ) : (
        <img loading="lazy" className={styles.imageContent__img} src={imageUrl} alt={fileId} />
      )}
    </>
  );
};

type ImageProps = {
  postId: string;
  pageId?: string;
  componentId?: string;
  isLastImage: boolean;
  imageLeftCount: number;
  onImageClick: () => void;
};

const Image = ({
  postId,
  isLastImage,
  pageId = '*',
  onImageClick,
  imageLeftCount,
  componentId = '*',
}: ImageProps) => {
  const { post: imagePost, isLoading } = usePost(postId);

  if (isLoading) return null;

  return (
    <Button
      onPress={() => onImageClick()}
      className={styles.imageContent__imgContainer}
      data-testid={`${pageId}/${componentId}/post_image`}
    >
      <ImageThumbnail
        fileId={imagePost.data.fileId}
        placeholder={<div className={styles.imageContent__skeleton}></div>}
      />
      {imageLeftCount > 0 && isLastImage && (
        <Typography.Headline className={styles.imageContent__imgCover}>
          + {imageLeftCount + 1}
        </Typography.Headline>
      )}
    </Button>
  );
};

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
          postId={postId}
          pageId={pageId}
          componentId={componentId}
          imageLeftCount={imageLeftCount}
          onImageClick={() => onImageClick(index)}
          isLastImage={index === first4Images.length - 1}
        />
      ))}
    </div>
  );
};
