import React, { useState } from 'react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { formatAltText } from '~/v4/social/utils';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge/ProductTagBadge';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import styles from './ImageContent.module.css';

type ImageContentProps = {
  pageId?: string;
  elementId?: string;
  componentId?: string;
  posts: Amity.Post<'image'>[];
  parentPostId: string;
  onImageClick: (imageIndex: number) => void;
};

export const ImageContent = ({
  posts,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  parentPostId,
  onImageClick,
}: ImageContentProps) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const first4Images = posts?.slice(0, 4);
  const imageLeftCount = Math.max(0, posts?.length - 4);

  if (!posts || posts[0]?.dataType !== 'image') return null;

  return (
    <div
      style={themeStyles}
      className={styles.imageContent}
      data-images-amount={Math.min(posts?.length ?? 0, 4)}
    >
      {first4Images.map((post: Amity.Post<'image'>, index: number) => (
        <Image
          key={post.postId}
          index={index}
          imagePost={post}
          pageId={pageId}
          componentId={componentId}
          imageLeftCount={imageLeftCount}
          totalCount={posts.length}
          onImageClick={() => onImageClick(index)}
          isLastImage={index === first4Images.length - 1}
          parentPostId={parentPostId}
        />
      ))}
    </div>
  );
};

type ImageProps = {
  index: number;
  imagePost: Amity.Post<'image'>;
  pageId?: string;
  totalCount: number;
  componentId?: string;
  isLastImage: boolean;
  imageLeftCount: number;
  parentPostId: string;
  onImageClick: () => void;
};

function Image({
  index,
  imagePost,
  isLastImage,
  totalCount,
  pageId = '*',
  onImageClick,
  imageLeftCount,
  componentId = '*',
  parentPostId,
}: ImageProps) {
  const [isBrokenImg, setIsBrokenImg] = useState(false);
  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: 'image',
    sourceId: parentPostId,
  });

  const file = imagePost?.getImageInfo();

  if (!imagePost) return null;

  const handleShowProductTags = () => {
    if (imagePost.productTags) {
      showProductTagList(imagePost.productTags);
    }
  };

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
      {imagePost.productTags && imagePost.productTags.length > 0 && (
        <div className={styles.imageContent__productTagButton}>
          <ProductTagBadge
            selectedProductTags={imagePost.productTags}
            onClick={handleShowProductTags}
          />
        </div>
      )}
    </Button>
  );
}
