import React, { useMemo } from 'react';

import useImage from '~/v4/core/hooks/useImage';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit/index';
import styles from './ImageContent.module.css';

interface ImageContentProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  post: Amity.Post<'image'>;
  onImageClick: (imageIndex: number) => void;
}

const Image = ({ fileId }: { fileId: string }) => {
  const imageUrl = useImage({
    fileId,
  });

  return <img loading="lazy" className={styles.imageContent__img} src={imageUrl} alt={fileId} />;
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

  const first4Images = useMemo(() => post.children.slice(0, 4), [post.children]);

  const imageLeftCount = Math.max(0, post.children.length - 4);

  const posts = usePostByIds(first4Images);

  const imagePosts = posts.filter((post) => post.dataType === 'image');

  if (imagePosts.length === 0) {
    return null;
  }

  return (
    <div
      className={styles.imageContent}
      style={themeStyles}
      data-images-amount={Math.min(post.children.length, 4)}
    >
      {imagePosts.map((post, index) => (
        <div className={styles.imageContent__imgContainer} onClick={() => onImageClick(index)}>
          <Image fileId={post.data.fileId} />
          {imageLeftCount > 0 && index === posts.length - 1 && (
            <Typography.Heading className={styles.imageContent__imgCover}>
              + {imageLeftCount}
            </Typography.Heading>
          )}
        </div>
      ))}
    </div>
  );
};
