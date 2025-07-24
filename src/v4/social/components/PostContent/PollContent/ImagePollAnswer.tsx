import React, { FC, useState } from 'react';
import styles from './PollContent.module.css';
import { Typography } from '~/v4/core/components';
import { SingleImageViewer } from '~/v4/social/internal-components/SingleImageViewer';
import { Button } from '~/v4/core/components/AriaButton';
import ExpandImage from '~/v4/icons/Expand';
import useFile from '~/v4/core/hooks/useFile';
import { FileRepository } from '@amityco/ts-sdk';

interface ImagePollAnswerProps {
  fileId?: string;
  label?: string;
  pageId?: string;
  votedPrecentage?: string;
  votedCountText?: React.ReactNode;
  isOwner?: boolean;
  isTopVoted?: boolean;
  isDisabled?: boolean;
}

export const ImagePollAnswer: FC<ImagePollAnswerProps> = ({
  fileId,
  label,
  pageId,
  isOwner,
  votedPrecentage,
  votedCountText,
  isTopVoted,
  isDisabled,
}) => {
  const [openImageViewer, setOpenImageViewer] = useState(false);

  const imageFile = useFile(fileId) as Amity.File<'image'>;
  const url = imageFile ? FileRepository.fileUrlWithSize(imageFile?.fileUrl, 'medium') : '';

  if (!fileId || !url) return null;

  return (
    <>
      <div
        className={styles.pollContent__imageOption__wrapper}
        data-is-voted={!!votedPrecentage}
        data-is-top-voted={isTopVoted}
        data-disabled={isDisabled}
      >
        <div className={styles.pollContent__imageOption__container}>
          <img
            src={url}
            className={styles.pollContent__imageOption}
            alt={imageFile.altText ?? label}
          />
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
          onPress={() => setOpenImageViewer(true)}
          className={styles.pollContent__imageOption__button}
          data-is-voted={!!votedPrecentage}
        >
          <ExpandImage className={styles.pollContent__imageOption__buttonIcon} />
        </Button>
      </div>
      {openImageViewer && (
        <SingleImageViewer
          fileId={fileId}
          onClose={() => setOpenImageViewer(false)}
          pageId={pageId}
          isOwner={isOwner}
        />
      )}
    </>
  );
};
