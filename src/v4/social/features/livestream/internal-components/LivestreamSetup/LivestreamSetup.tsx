import React, { useCallback, useRef, useState } from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { Label } from 'react-aria-components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { ReadOnlyToggle } from '~/v4/social/features/livestream/internal-components/ReadOnlyToggle/ReadOnlyToggle';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput';
import { CameraOutlined } from '~/v4/icons/CameraOutlined';
import { LivestreamOutlined } from '~/v4/icons/LivestreamOutlined';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import styles from './LivestreamSetup.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ImageIcon } from '~/v4/icons/Image';
import Bin from '~/v4/icons/Bin';
import { useMemo } from 'react';
import clsx from 'clsx';
import useImageUpload from '~/v4/social/hooks/useImageUpload';
import { LoadingSpinner } from '~/v4/social/features/livestream/internal-components/LivestreamOverlay/LivestreamOverlay';
import CameraMovie from '~/v4/icons/CameraMovie';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { TagProductsButton } from '~/v4/social/features/livestream/internal-components/TagProductsButton/TagProductsButton';
import { ProductTagSelectionWrapper } from '~/v4/social/features/product-tagged/internal-components/ProductTagSelectionWrapper';
import { ManageProductTagList } from '~/v4/social/features/product-tagged/components/ManageProductTagList';

export interface LivestreamSetupProps {
  // Target and UI state
  isTargetEvent: boolean;
  targetType: 'community' | 'user';
  isCoHost?: boolean;

  // Form state
  livestreamTitle?: string;
  livestreamDescription?: string;
  readOnly?: boolean;
  isEnabledProductTag?: boolean;

  // File upload state
  isPending: boolean;

  // Validation
  isGoLiveButtonDisabled: boolean;

  // Page props
  pageId: string;

  // Handlers
  setLivestreamTitle?: (title: string) => void;
  setLivestreamDescription?: (description: string) => void;
  setReadOnly?: (readOnly: boolean) => void;
  onGoLive: () => void;
  onThumbnailFileIdChanged?: (fileId?: string) => void;

  // Product tags
  productTags?: Amity.MediaProductTag[];
  onProductTagsChange?: (tags: Amity.MediaProductTag[]) => void;

  pinnedProductId?: string;
  onPinnedProductIdChange?: (pinnedProductId: string | undefined) => void;
}

export const LivestreamSetup: React.FC<LivestreamSetupProps> = ({
  isTargetEvent,
  targetType,
  livestreamTitle,
  livestreamDescription,
  readOnly,
  isPending = false,
  isGoLiveButtonDisabled,
  isEnabledProductTag,
  pageId,
  isCoHost,
  setLivestreamTitle,
  setLivestreamDescription,
  setReadOnly,
  onThumbnailFileIdChanged,
  onGoLive,
  productTags = [],
  onProductTagsChange,
  pinnedProductId,
  onPinnedProductIdChange,
}) => {
  const MAX_PRODUCTS = 20;
  const livestreamTitleLabel = useString('amity_social_label_livestream_title');
  const livestreamDescriptionLabel = useString('amity_social_label_livestream_description');
  const nameYourLivePlaceholder = useString('amity_social_name_your_live');
  const shareWhatPlaceholder = useString('amity_social_share_what_this_live_is_all_about');
  const liveSettingLabel = useString('amity_social_live_setting');
  const goLiveLabel = useString('amity_social_status_go_live');
  const changeThumbnailLabel = useString('amity_social_button_change_thumbnail');
  const deleteThumbnailLabel = useString('amity_social_button_delete_thumbnail');
  const cohostBackstageTitleLabel = useString('amity_social_label_cohost_backstage_title');
  const cohostBackstageDescLabel = useString(
    'amity_social_status_set_up_your_camera_mic_and_lighting_before_the_livestre',
  );
  const { uploadSingleImage, isUploading } = useImageUpload();
  const { openPopup, closePopup } = usePopupContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localFile, setLocalFile] = useState<File>();
  const [file, setFile] = useState<Amity.File>();

  const uploadFile = async (file: File) => {
    const { data } = await uploadSingleImage({ file });
    if (data?.[0]) {
      setFile(data?.[0]);
      onThumbnailFileIdChanged?.(data?.[0].fileId);
    }
  };

  const triggerFileInput = useCallback(() => {
    if (fileInputRef.current) {
      // Store the callback for later use
      fileInputRef.current.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const files = target.files;

        if (files?.[0]) {
          setLocalFile(files?.[0]);
          uploadFile(files[0]);
        }

        // Reset the input value to allow selecting the same file again
        target.value = '';
      };

      fileInputRef.current.click();
    }
  }, []);

  const fileUrl = useMemo(() => {
    if (file?.fileUrl) return getFileUrlWithSize(file?.fileUrl, 'medium');
    return '';
  }, [file?.fileUrl]);

  const renderThumbnailMenu = useCallback(
    ({ closePopover }: { closePopover: () => void }) => {
      return (
        <div className={styles.livestreamSetup__thumbnail__menu}>
          <Button
            variant="default"
            className={styles.livestreamSetup__thumbnail__menuItem}
            onPress={() => {
              triggerFileInput();
              closePopover();
            }}
          >
            <ImageIcon className={styles.livestreamSetup__thumbnail__menuItem__icon} />
            <Typography.BodyBold>{changeThumbnailLabel}</Typography.BodyBold>
          </Button>
          <Button
            variant="default"
            onPress={() => {
              setLocalFile(undefined);
              setFile(undefined);
              onThumbnailFileIdChanged?.(undefined);
            }}
            className={clsx(
              styles.livestreamSetup__thumbnail__menuItem,
              styles.livestreamSetup__thumbnail__menuItem__delete,
            )}
          >
            <Bin className={styles.livestreamSetup__thumbnail__menuItem__icon} />
            <Typography.BodyBold>{deleteThumbnailLabel}</Typography.BodyBold>
          </Button>
        </div>
      );
    },
    [triggerFileInput],
  );

  const localFileUrl = useMemo(() => {
    if (localFile) {
      return URL.createObjectURL(localFile);
    }
    return null;
  }, [localFile]);

  const handleOpenProductTagSelection = useCallback(() => {
    const popupId = 'product-tag-livestream';
    openPopup({
      id: popupId,
      pageId,
      view: 'desktop',
      children: ({ close }) => (
        <ProductTagSelectionWrapper
          renderMode="livestream"
          initialProductTags={productTags}
          onProductTagsChange={onProductTagsChange}
          pageId={pageId}
          displayMode="desktop"
          mode="livestream"
          maxCount={MAX_PRODUCTS}
          pinnedProductId={pinnedProductId}
          onPinnedProductIdChange={onPinnedProductIdChange}
          onClose={() => closePopup()}
          onDone={(tags) => {
            onProductTagsChange?.(tags);
            closePopup();
          }}
        />
      ),
    });
  }, [
    openPopup,
    closePopup,
    pageId,
    productTags,
    pinnedProductId,
    onProductTagsChange,
    onPinnedProductIdChange,
  ]);

  const handleOpenManageProductTags = useCallback(() => {
    const popupId = 'manage-product-tags';
    openPopup({
      id: popupId,
      pageId,
      view: 'desktop',
      children: ({ close }) => (
        <ManageProductTagList
          pageId={pageId}
          renderMode="livestream"
          productTags={productTags}
          onProductTagsChange={onProductTagsChange}
          onPinnedProductIdChange={onPinnedProductIdChange}
          maxCount={MAX_PRODUCTS}
          pinnedProductId={pinnedProductId}
          onClose={(updatedTags, updatedPinnedId) => {
            onProductTagsChange?.(updatedTags);
            if (onPinnedProductIdChange) {
              onPinnedProductIdChange(updatedPinnedId);
            }
            closePopup();
          }}
          sourceId=""
        />
      ),
    });
  }, [
    openPopup,
    closePopup,
    pageId,
    productTags,
    pinnedProductId,
    onProductTagsChange,
    onPinnedProductIdChange,
    isEnabledProductTag,
  ]);

  return (
    <>
      {/* Hidden file input */}
      {!isCoHost && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          style={{ display: 'none' }}
        />
      )}
      <div className={styles.livestreamSetup__inner} data-cohost={isCoHost}>
        {!isCoHost ? (
          <>
            {!isTargetEvent && (
              <div className={styles.livestreamSetup__thumbnail}>
                {(!isPending && fileUrl) || (isUploading && localFileUrl) ? (
                  <>
                    <img
                      alt="livestream-thumbnail"
                      src={isUploading ? localFileUrl! : fileUrl}
                      className={styles.livestreamSetup__thumbnail__image}
                    />
                    {isUploading && (
                      <div className={styles.livestreamSetup__loadingSpinner}>
                        <LoadingSpinner />
                      </div>
                    )}
                    <div className={styles.livestreamSetup__thumbnail__overlay}>
                      {!isUploading && (
                        <Popover
                          placement="bottom"
                          trigger={({ openPopover }) => {
                            return (
                              <Button variant="default" onPress={() => openPopover()}>
                                <CameraOutlined
                                  className={styles.livestreamSetup__thumbnail__icon}
                                />
                              </Button>
                            );
                          }}
                        >
                          {({ closePopover }) => renderThumbnailMenu({ closePopover })}
                        </Popover>
                      )}
                    </div>
                  </>
                ) : (
                  <Button
                    className={styles.livestreamSetup__thumbnail__overlay}
                    variant="default"
                    onPress={() => triggerFileInput()}
                  >
                    <CameraOutlined className={styles.livestreamSetup__thumbnail__icon} />
                  </Button>
                )}
              </div>
            )}
            <div className={styles.livestreamSetup__form}>
              <form>
                {!isTargetEvent && (
                  <>
                    <UnderlineInput
                      pageId={pageId}
                      name={livestreamTitleLabel}
                      label={livestreamTitleLabel}
                      maxLength={30}
                      showCounter={true}
                      elementId="livestream_title"
                      value={livestreamTitle}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setLivestreamTitle?.(e.target.value)
                      }
                      placeholder={nameYourLivePlaceholder}
                      disabled={isPending}
                    />
                    <UnderlineInput
                      pageId={pageId}
                      name={livestreamDescriptionLabel}
                      label={livestreamDescriptionLabel}
                      maxLength={300}
                      showCounter={true}
                      elementId="livestream_description"
                      value={livestreamDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setLivestreamDescription?.(e.target.value)
                      }
                      placeholder={shareWhatPlaceholder}
                      optional={true}
                      disabled={isPending}
                    />
                  </>
                )}
                {targetType !== 'user' && readOnly !== undefined && setReadOnly !== undefined && (
                  <div className={styles.livestreamSetup__liveSetting}>
                    <Label>
                      <Typography.TitleBold>{liveSettingLabel}</Typography.TitleBold>
                    </Label>
                    <ReadOnlyToggle
                      isSelected={readOnly}
                      onChange={setReadOnly}
                      className={styles.livestreamSetup__readOnly}
                    />
                  </div>
                )}

                {isEnabledProductTag && targetType !== 'user' && (
                  <TagProductsButton
                    productTagCount={productTags.length}
                    isPending={isPending}
                    onPress={
                      productTags.length > 0
                        ? handleOpenManageProductTags
                        : handleOpenProductTagSelection
                    }
                  />
                )}
              </form>
            </div>
          </>
        ) : (
          <div className={styles.livestreamSetup__coHost__description}>
            <CameraMovie className={styles.livestreamSetup__coHost__descriptionIcon} />
            <Typography.TitleBold className={styles.livestreamSetup__coHost__descriptionText}>
              {cohostBackstageTitleLabel}
            </Typography.TitleBold>
            <Typography.Caption className={styles.livestreamSetup__coHost__descriptionText}>
              {cohostBackstageDescLabel}
            </Typography.Caption>
          </div>
        )}

        <div className={styles.livestreamSetup__footer}>
          <Button
            variant="default"
            className={styles.livestreamSetup__goLive__button}
            isDisabled={isGoLiveButtonDisabled || isPending}
            onPress={onGoLive}
          >
            <LivestreamOutlined className={styles.livestreamSetup__goLive__buttonIcon} />
            <Typography.BodyBold>{goLiveLabel}</Typography.BodyBold>
          </Button>
        </div>
      </div>
    </>
  );
};
