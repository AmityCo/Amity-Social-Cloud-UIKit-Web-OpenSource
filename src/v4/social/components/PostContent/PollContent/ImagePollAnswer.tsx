import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import { Typography } from '~/v4/core/components';
import { FileImageViewer } from '~/v4/social/internal-components/FileImageViewer';
import { Button } from '~/v4/core/components/AriaButton';
import ExpandImage from '~/v4/icons/Expand';
import { BrokenImage } from '~/v4/icons/BrokenImage';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';

interface ImagePollAnswerProps {
  imageFile?: Amity.File<'image'>;
  label?: string;
  pageId?: string;
  votedPrecentage?: string;
  votedCountText?: React.ReactNode;
  isOwner?: boolean;
  isTopVoted?: boolean;
  isDisabled?: boolean;
}

export const ImagePollAnswer: FC<ImagePollAnswerProps> = ({
  imageFile,
  label,
  pageId,
  isOwner,
  votedPrecentage,
  votedCountText,
  isTopVoted,
  isDisabled,
}) => {
  const [isBrokenImage, setIsBrokenImage] = useState(false);
  const { openPopup, closePopup } = usePopupContext();
  const { isDesktop } = useResponsive();

  const openImageViewer = (file?: Amity.File<'image'>) => {
    file &&
      openPopup({
        id: 'poll-image-viewer',
        disabledAnimation: true,
        isDismissable: isDesktop,
        children: (
          <FileImageViewer
            pageId={pageId}
            file={file}
            isOwner={isOwner}
            onClose={() => closePopup('poll-image-viewer')}
          />
        ),
      });
  };

  const url = imageFile ? getFileUrlWithSize(imageFile.fileUrl, 'medium') : '';

  return (
    <>
      <div
        className={styles.pollContent__imageOption__wrapper}
        data-is-voted={!!votedPrecentage}
        data-is-top-voted={isTopVoted}
        data-disabled={isDisabled}
      >
        <div className={styles.pollContent__imageOption__container}>
          {!imageFile?.fileId || isBrokenImage ? (
            <div className={styles.pollContent__imageOption__imageBroken}>
              <BrokenImage className={styles.pollContent__imageOption__imageBroken__icon} />
            </div>
          ) : imageFile?.fileId && !url ? (
            <div className={styles.pollContent__imageOption__loading} />
          ) : (
            <img
              src={url}
              className={styles.pollContent__imageOption}
              alt={imageFile?.altText ?? label}
              onError={() => setIsBrokenImage(true)}
            />
          )}

          {/* Move overlay to cover only the image */}
          {votedPrecentage && (
            <>
              {isTopVoted && <div className={styles.pollContent__imageOption__overlay__topVoted} />}
              <div className={styles.pollContent__imageOption__overlay}>
                <Typography.Headline className={styles.pollContent__imageOption__percentage}>
                  {votedPrecentage}%
                </Typography.Headline>
              </div>
            </>
          )}
        </div>
        {label && (
          <Typography.BodyBold
            className={styles.pollContent__imageOption__text}
            data-disabled={isDisabled}
          >
            {label}
          </Typography.BodyBold>
        )}
        {votedCountText}

        <Button
          variant="text"
          onPress={() => openImageViewer(imageFile)}
          className={styles.pollContent__imageOption__button}
          data-is-voted={!!votedPrecentage}
        >
          <ExpandImage className={styles.pollContent__imageOption__buttonIcon} />
        </Button>
      </div>
    </>
  );
};
