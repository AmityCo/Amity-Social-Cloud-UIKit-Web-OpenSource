import { FileRepository } from '@amityco/ts-sdk';
import React, { useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import useFile from '~/v4/core/hooks/useFile';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

import styles from './SingleImageViewer.module.css';

interface SingleImageViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  fileId: string;
  isOwner?: boolean;
  onClose(): void;
}

export function SingleImageViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  fileId,
  isOwner,
  onClose,
}: SingleImageViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const { setDrawerData, removeDrawerData } = useDrawer();

  const imageFile = useFile(fileId) as Amity.File<'image'>;

  const url = FileRepository.fileUrlWithSize(imageFile.fileUrl, 'large');

  const [isOpen, setIsOpen] = useState(false);
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {url && !isBrokenImg ? (
            <img
              src={url}
              alt={imageFile.altText}
              className={styles.fullImage}
              onError={() => setIsBrokenImg(true)}
            />
          ) : (
            <div className={styles.singleImageViewer__brokenImage} />
          )}

          <div className={styles.singleImageViewer__optionWrapper}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.singleImageViewer__clearButton}
              imgClassName={styles.singleImageViewer__clearButton__img}
              onPress={() => {
                onClose();
                removeDrawerData();
              }}
            />
            {isOwner && (
              <Popover
                trigger={{
                  pageId,
                  className: styles.singleImageViewer__menuButton,
                  iconClassName: styles.singleImageViewer__menuButton__icon,
                  onClick: () => {
                    setDrawerData({
                      content: (
                        <MediaMenu
                          pageId={pageId}
                          file={imageFile}
                          onEditAltTextPress={
                            isOwner
                              ? () => {
                                  setIsOpen(true);
                                  removeDrawerData();
                                }
                              : undefined
                          }
                        />
                      ),
                    });
                  },
                }}
              >
                {({ closePopover }) => {
                  return (
                    <MediaMenu
                      pageId={pageId}
                      file={imageFile}
                      onEditAltTextPress={
                        isOwner
                          ? () => {
                              setIsOpen(true);
                              closePopover();
                            }
                          : undefined
                      }
                    />
                  );
                }}
              </Popover>
            )}
          </div>
        </div>
      </div>
      {imageFile && isOwner && (
        <AltTextBottomSheet file={imageFile} mode="edit" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
