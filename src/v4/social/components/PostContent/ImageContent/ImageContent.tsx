import React, { useMemo } from 'react';

import { useImage } from '~/v4/core/hooks/useImage';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';
import styles from './ImageContent.module.css';
import usePost from '~/v4/core/hooks/objects/usePost';
import { Button } from '~/v4/core/natives/Button';

interface ImageContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post<'image'>;
  onImageClick: (imageIndex: number) => void;
}

const ImageThumbnail = ({ fileId }: { fileId: string }) => {
  const imageUrl = useImage({
    fileId,
  });

  return <img loading="lazy" className={styles.imageContent__img} src={imageUrl} alt={fileId} />;
};

const Image = ({
  postId,
  index,
  imageLeftCount,
  postAmount,
  onImageClick,
}: {
  postId: string;
  index: number;
  imageLeftCount: number;
  postAmount: number;
  onImageClick: () => void;
}) => {
  const { post: imagePost, isLoading } = usePost(postId);

  if (isLoading) {
    return null;
  }

  return (
    <Button
      key={imagePost.postId}
      className={styles.imageContent__imgContainer}
      onPress={() => onImageClick()}
    >
      <ImageThumbnail fileId={imagePost.data.fileId} />
      {imageLeftCount > 0 && index === postAmount - 1 && (
        <Typography.Heading className={styles.imageContent__imgCover}>
          + {imageLeftCount}
        </Typography.Heading>
      )}
    </Button>
  );
};

export const ImageContent = ({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  post,
  onImageClick = () => {},
}: ImageContentProps) => {
  const { themeStyles } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const first4Images = post.children.slice(0, 4);

  const imageLeftCount = Math.max(0, post.children.length - 4);

  const { post: childPost, isLoading } = usePost(post.children?.[0]);

  if (isLoading) {
    return null;
  }

  if (childPost?.dataType !== 'image') {
    return null;
  }

  return (
    <div
      className={styles.imageContent}
      style={themeStyles}
      data-images-amount={Math.min(post.children.length, 4)}
    >
      {first4Images.map((postId: string, index: number) => (
        <Image
          key={postId}
          postId={postId}
          index={index}
          imageLeftCount={imageLeftCount}
          postAmount={post.children.length}
          onImageClick={() => onImageClick(index)}
        />
      ))}
    </div>
  );
};
