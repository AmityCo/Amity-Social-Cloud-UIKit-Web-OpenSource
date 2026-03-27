import { FileRepository } from '@amityco/ts-sdk';
import React, { useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import useFile from '~/v4/core/hooks/useFile';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { MenuButton } from '~/v4/social/elements';

import styles from './FileImageViewer.module.css';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import useLocalFile from '~/v4/core/hooks/useLocalFile';
import { useQueryClient } from '@tanstack/react-query';

interface FileImageViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  file: Amity.File<'image'>;
  fileUrl?: string;
  isOwner?: boolean;
  onClose(): void;
}

export function FileImageViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  file,
  isOwner,
  fileUrl,
  onClose,
}: FileImageViewerProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isDesktop } = useResponsive();

  const queryClient = useQueryClient();
  const imageFile = useLocalFile(file.fileId) as Amity.File<'image'>;
  const url = imageFile?.fileUrl ? getFileUrlWithSize(imageFile.fileUrl, 'medium') : fileUrl;

  const refetchLocalFile = (file: Amity.File<'image'>) => {
    queryClient.refetchQueries({
      queryKey: ['asc-uikit', 'FileRepository', 'getLocalFile', file.fileId],
    });
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {url && !isBrokenImg ? (
            <img
              src={url}
              alt={file.altText}
              className={styles.fullImage}
              onError={() => setIsBrokenImg(true)}
            />
          ) : (
            <div className={styles.fileImageViewer__brokenImage} />
          )}

          <div className={styles.fileImageViewer__optionWrapper}>
            <ClearButton
              pageId={pageId}
              componentId={componentId}
              defaultClassName={styles.fileImageViewer__clearButton}
              imgClassName={styles.fileImageViewer__clearButton__img}
              onPress={() => {
                onClose();
                removeDrawerData();
              }}
            />
            {isOwner && (
              <Popover
                trigger={({ openPopover, isDesktop }) => (
                  <MenuButton
                    pageId={pageId}
                    className={styles.fileImageViewer__menuButton}
                    variant="filled"
                    iconClassName={styles.fileImageViewer__menuButton__icon}
                    onClick={() => {
                      isDesktop
                        ? openPopover()
                        : setDrawerData({
                            content: (
                              <MediaMenu
                                pageId={pageId}
                                file={imageFile}
                                onAltTextChange={refetchLocalFile}
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
                    }}
                  />
                )}
              >
                {({ closePopover }) => {
                  return (
                    <MediaMenu
                      pageId={pageId}
                      file={imageFile}
                      onAltTextChange={refetchLocalFile}
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
      {imageFile && isOwner && !isDesktop && (
        <AltTextBottomSheet
          file={imageFile}
          mode="edit"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onAltTextChange={refetchLocalFile}
        />
      )}
    </div>
  );
}
