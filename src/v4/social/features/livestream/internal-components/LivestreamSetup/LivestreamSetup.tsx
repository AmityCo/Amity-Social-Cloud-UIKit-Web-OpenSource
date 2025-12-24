import React, { useCallback, useRef, useState } from 'react';
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

export interface LivestreamSetupProps {
  // Target and UI state
  isTargetEvent: boolean;
  targetType: 'community' | 'user';
  isCoHost?: boolean;

  // Form state
  livestreamTitle?: string;
  livestreamDescription?: string;
  readOnly?: boolean;

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
}

export const LivestreamSetup: React.FC<LivestreamSetupProps> = ({
  isTargetEvent,
  targetType,
  livestreamTitle,
  livestreamDescription,
  readOnly,
  isPending = false,
  isGoLiveButtonDisabled,
  pageId,
  isCoHost,
  setLivestreamTitle,
  setLivestreamDescription,
  setReadOnly,
  onThumbnailFileIdChanged,
  onGoLive,
}) => {
  const { uploadSingleImage, isUploading } = useImageUpload();

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
            <Typography.BodyBold>Change thumbnail</Typography.BodyBold>
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
            <Typography.BodyBold>Delete thumbnail</Typography.BodyBold>
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
                      name="Live title"
                      label="Live title"
                      maxLength={30}
                      showCounter={true}
                      elementId="livestream_title"
                      value={livestreamTitle}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setLivestreamTitle?.(e.target.value)
                      }
                      placeholder="Name your live"
                      disabled={isPending}
                    />
                    <UnderlineInput
                      pageId={pageId}
                      name="Description"
                      label="Description"
                      maxLength={300}
                      showCounter={true}
                      elementId="livestream_description"
                      value={livestreamDescription}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setLivestreamDescription?.(e.target.value)
                      }
                      placeholder="Share what this live is all about"
                      optional={true}
                      disabled={isPending}
                    />
                  </>
                )}
                {targetType !== 'user' && readOnly !== undefined && setReadOnly !== undefined && (
                  <div className={styles.livestreamSetup__liveSetting}>
                    <Label>
                      <Typography.TitleBold>Live Setting</Typography.TitleBold>
                    </Label>
                    <ReadOnlyToggle
                      isSelected={readOnly}
                      onChange={setReadOnly}
                      className={styles.livestreamSetup__readOnly}
                    />
                  </div>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className={styles.livestreamSetup__coHost__description}>
            <CameraMovie className={styles.livestreamSetup__coHost__descriptionIcon} />
            <Typography.TitleBold className={styles.livestreamSetup__coHost__descriptionText}>
              Get ready before going live.
            </Typography.TitleBold>
            <Typography.Caption className={styles.livestreamSetup__coHost__descriptionText}>
              Set up your camera, mic, and lighting before the live stream begins.
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
            <Typography.BodyBold>Go Live</Typography.BodyBold>
          </Button>
        </div>
      </div>
    </>
  );
};
