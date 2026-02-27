import React from 'react';
import { Drawer as $Drawer } from 'vaul';
import CloseIcon from '~/v4/icons/Close';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { getImageUrl } from '~/v4/utils/getImageUrl';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { BackButton, CloseButton } from '~/v4/social/elements';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { isAmityFile, isImageFile } from '~/v4/utils/checkFileType';
import { AltTextConfig } from '~/v4/social/components/AltTextConfig';
import { Button as AriaButton } from '~/v4/core/components/AriaButton';
import { AltTextBadge } from '~/v4/social/internal-components/AltTextBadge';
import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';
import { ProgressSpinner } from '~/v4/social/internal-components/ProgressSpinner/ProgressSpinner';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge';
import { useProductTagSelection } from '~/v4/social/features/product-tagged/hooks';
import styles from './ImageThumbnail.module.css';

type ImageThumbnailProps = {
  pageId?: string;
  files: TFileItem<'image'>[];
  componentId?: string;
  postImages?: Amity.Post<'image'>[];
  progress: { [key: string]: number };
  removeFile: (file: File | Amity.File<'image'>, index?: number) => void;
  onRemovePostImage?: (fileId: string) => void;
  onAltTextChange: (file: Amity.File<'image'>, altText: string) => void;
  onFileProductTagsChange?: (file: Amity.File<'image'>, productTags: Amity.ProductTag[]) => void;
  onChildPostProductTagsChange?: (postId: string, productTags: Amity.ProductTag[]) => void;
  isImagePollPost?: boolean;
  ErrorImageMenuButton?: () => void;
  productTagsReachLimit?: boolean;
};

export function ImageThumbnail({
  files,
  progress,
  removeFile,
  pageId = '*',
  postImages = [],
  componentId = '*',
  onRemovePostImage,
  onAltTextChange,
  onFileProductTagsChange,
  onChildPostProductTagsChange,
  isImagePollPost = false,
  ErrorImageMenuButton,
  productTagsReachLimit = false,
}: ImageThumbnailProps) {
  const hasNewImages = files.length > 0 && files.some((file) => isImageFile(file));
  const hasPostImages = postImages.length > 0;

  if (!hasNewImages && !hasPostImages) return null;

  const totalImages =
    (hasNewImages ? files.filter((file) => isImageFile(file)).length : 0) +
    (hasPostImages ? postImages.length : 0);

  return (
    <div
      data-images-amount={Math.min(totalImages, 3)}
      data-image-poll={isImagePollPost}
      className={styles.thumbnail__container}
    >
      {postImages?.map((post) => (
        <PostImageItem
          post={post}
          pageId={pageId}
          key={post.data?.fileId}
          componentId={componentId}
          totalImages={totalImages}
          onRemovePostImage={onRemovePostImage || (() => {})}
          onChildPostProductTagsChange={onChildPostProductTagsChange}
          productTagsReachLimit={productTagsReachLimit}
        />
      ))}

      {files
        .filter((file) => isImageFile(file))
        .map((file) => (
          <FileImageItem
            file={file}
            pageId={pageId}
            progress={progress}
            key={`file-${file.id}`}
            componentId={componentId}
            totalImages={totalImages}
            onRemoveFile={() => removeFile(file.file)}
            onAltTextChange={onAltTextChange}
            onFileProductTagsChange={onFileProductTagsChange}
            isImagePollPost={isImagePollPost}
            ErrorImageMenuButton={ErrorImageMenuButton}
            productTagsReachLimit={productTagsReachLimit}
          />
        ))}
    </div>
  );
}

type PostImageItemProps = {
  pageId: string;
  totalImages: number;
  componentId: string;
  post: Amity.Post<'image'>;
  productTagsReachLimit?: boolean;
  onRemovePostImage: (fileId: string) => void;
  onChildPostProductTagsChange?: (postId: string, productTags: Amity.ProductTag[]) => void;
};

function PostImageItem({
  post,
  pageId,
  totalImages,
  componentId,
  productTagsReachLimit,
  onRemovePostImage,
  onChildPostProductTagsChange,
}: PostImageItemProps) {
  const file = post?.getImageInfo();
  const { openProductTagSelection } = useProductTagSelection<'image'>({
    pageId,
    onChildPostProductTagsChange,
  });

  const handleProductTagClick = () => {
    openProductTagSelection({ postId: post.postId, initialProductTags: post.productTags });
  };

  if (!file || !post.postId) return null;

  return (
    <div key={`post-${post.data?.fileId}`} className={styles.thumbnail__wrapper}>
      <img
        alt={file.altText ?? ''}
        className={styles.thumbnail}
        src={getFileUrlWithSize(file.fileUrl)}
      />
      <Button
        type="reset"
        className={styles.closeButton}
        onPress={() => post.data?.fileId && onRemovePostImage(post.data.fileId)}
        data-testid={`${pageId}/${componentId}/remove_thumbnail`}
      >
        <CloseIcon className={styles.closeIcon} />
      </Button>
      <>
        {/* <AltText file={post.data.file} onAltTextChange={onAltTextChange} /> */}
        {onChildPostProductTagsChange &&
          ((post.productTags ?? [])?.length !== 0 || !productTagsReachLimit) && (
            <div className={styles.thumbnail__productTagBadge}>
              <ProductTagBadge
                selectedProductTags={post.productTags ?? []}
                onClick={handleProductTagClick}
              />
            </div>
          )}
      </>
    </div>
  );
}

type FileImageItemProps = {
  pageId?: string;
  file: TFileItem<'image'>;
  totalImages: number;
  componentId?: string;
  onRemoveFile: () => void;
  progress: { [key: string]: number };
  onAltTextChange: ImageThumbnailProps['onAltTextChange'];
  onFileProductTagsChange?: ImageThumbnailProps['onFileProductTagsChange'];
  isImagePollPost?: boolean;
  ErrorImageMenuButton?: () => void;
  productTagsReachLimit?: boolean;
};

function FileImageItem({
  file,
  pageId,
  progress,
  totalImages,
  componentId,
  onRemoveFile,
  onAltTextChange,
  onFileProductTagsChange,
  ErrorImageMenuButton,
  isImagePollPost = false,
  productTagsReachLimit = false,
}: FileImageItemProps) {
  const isUploading = progress[file.id] && !isAmityFile(file.file);
  const hasError = file.errorText && !('fileId' in file);
  const { openProductTagSelection } = useProductTagSelection<'image'>({
    pageId,
    onFileProductTagsChange,
  });

  const handleProductTagClick = () => {
    if (!isAmityFile(file.file)) return;
    openProductTagSelection({ file: file.file, initialProductTags: file.productTags });
  };

  return (
    <div
      key={`file-${file.id}`}
      data-image-poll={isImagePollPost}
      className={styles.thumbnail__wrapper}
    >
      <Thumbnail file={file} />
      {(isUploading || hasError) && <div className={styles.thumbnail__overlay} />}

      {!isImagePollPost && (
        <RemoveButton testId={`${pageId}/${componentId}/remove_thumbnail`} onPress={onRemoveFile} />
      )}
      {isUploading && (
        <div className={styles.icon__status}>
          <ProgressSpinner progress={progress[file.id] ?? 100} />
        </div>
      )}
      {hasError && (
        <div className={styles.icon__status__error}>
          <ExclamationCircle />
        </div>
      )}
      {hasError && ErrorImageMenuButton?.()}
      {isAmityFile(file.file) && !isUploading && !hasError && (
        <>
          <AltText file={file.file} onAltTextChange={onAltTextChange} />
          {onFileProductTagsChange &&
            ((file.productTags ?? [])?.length !== 0 || !productTagsReachLimit) && (
              <div className={styles.thumbnail__productTagBadge}>
                <ProductTagBadge
                  selectedProductTags={file.productTags ?? []}
                  onClick={handleProductTagClick}
                />
              </div>
            )}
        </>
      )}
    </div>
  );
}

type ThumbnailProps = {
  testId?: string;
  file: TFileItem<'image'>;
};

function Thumbnail({ file, testId }: ThumbnailProps) {
  return (
    <img
      data-testid={testId}
      src={getImageUrl(file)}
      className={styles.thumbnail}
      alt={isAmityFile(file.file) ? file.file.altText ?? '' : ''}
    />
  );
}

type RemoveButtonProps = {
  testId?: string;
  onPress: () => void;
};

function RemoveButton({ onPress, testId }: RemoveButtonProps) {
  return (
    <Button data-testid={testId} type="reset" className={styles.closeButton} onPress={onPress}>
      <CloseIcon className={styles.closeIcon} />
    </Button>
  );
}

type AltTextProps = {
  file: Amity.File<'image'>;
  onAltTextChange: ImageThumbnailProps['onAltTextChange'];
};

function AltText({ file, onAltTextChange }: AltTextProps) {
  const { openPopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={styles.thumbnail__altText}>
      <AltTextBadge
        completed={!!file.altText}
        onPress={() => {
          !isDesktop
            ? setIsOpen(true)
            : openPopup({
                children: ({ close }) => {
                  return (
                    <AltTextConfig
                      result={(altText: string) => {
                        onAltTextChange(file, altText);
                        close();
                      }}
                      mode={
                        file.altText !== null
                          ? {
                              type: 'edit',
                              altText: file.altText || '',
                              media: { type: 'image', image: file },
                            }
                          : {
                              type: 'create',
                              media: { type: 'image', image: file },
                            }
                      }
                      renderHeader={({ count }) => (
                        <div className={styles.altTextConfig__header}>
                          <BackButton
                            onPress={close}
                            defaultClassName={styles.altTextConfig__header__icon}
                          />
                          <div>
                            <Typography.Headline>Alt text</Typography.Headline>
                            <Typography.Caption className={styles.altTextConfig__header__count}>
                              {count}/180
                            </Typography.Caption>
                          </div>
                        </div>
                      )}
                    />
                  );
                },
              });
        }}
      />
      <AltTextBottomSheet
        file={file}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAltTextChange={onAltTextChange}
      />
    </div>
  );
}

type AltTextBottomSheetProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  file: Amity.File<'image'>;
  setIsOpen: (isOpen: boolean) => void;
  onAltTextChange?: ImageThumbnailProps['onAltTextChange'];
};

export function AltTextBottomSheet({
  file,
  isOpen,
  setIsOpen,
  onAltTextChange,
  mode = 'create',
}: AltTextBottomSheetProps) {
  return (
    <$Drawer.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      snapPoints={[1]}
      activeSnapPoint={1}
      modal={false}
    >
      <$Drawer.Portal>
        <$Drawer.Overlay className={styles.drawer__overlay} />
        <$Drawer.Content className={styles.drawer__content}>
          <div className={styles.drawer__placeholder} />
          <AltTextConfig
            result={(altText: string) => {
              onAltTextChange?.(file, altText);
              setIsOpen(false);
            }}
            mode={
              file.altText !== null
                ? {
                    type: 'edit',
                    altText: file.altText || '',
                    media: { type: 'image', image: file },
                  }
                : {
                    type: 'create',
                    media: { type: 'image', image: file },
                  }
            }
            renderHeader={({ count, isDisabled }) => (
              <div className={styles.altTextConfig__mobile__header}>
                <CloseButton
                  onPress={() => setIsOpen(false)}
                  defaultClassName={styles.altTextConfig__mobile__header__icon}
                />
                <div className={styles.altTextConfig__mobile__header__title}>
                  <Typography.BodyBold>
                    {mode === 'create' ? 'Alt text' : 'Edit alt text'}
                  </Typography.BodyBold>
                  <Typography.Caption className={styles.altTextConfig__mobile__header__count}>
                    {count}/180
                  </Typography.Caption>
                </div>
                <AriaButton
                  type="submit"
                  size="medium"
                  variant="text"
                  color="primary"
                  form="alt-text-form"
                  isDisabled={isDisabled}
                >
                  {mode === 'create' ? 'Done' : 'Save'}
                </AriaButton>
              </div>
            )}
          />
        </$Drawer.Content>
      </$Drawer.Portal>
    </$Drawer.Root>
  );
}
