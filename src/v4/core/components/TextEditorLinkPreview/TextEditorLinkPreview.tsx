import React, { useEffect } from 'react';
import clsx from 'clsx';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview';
import { CloseButton } from '~/v4/social/elements/CloseButton';
import {
  useLinkPreview,
  UseLinkPreviewOptions,
  UrlHighlight,
} from '~/v4/core/components/TextEditor/hooks/useLinkPreview';
import styles from './TextEditorLinkPreview.module.css';

export interface LinkRetentionState {
  /** The debounced first URL - used for link retention when text is removed */
  debouncedFirstUrl: string | null;
  /** The hidden preview URL - URL that user manually dismissed */
  hiddenPreviewUrl: string | null;
}

export interface TextEditorLinkPreviewProps extends UseLinkPreviewOptions {
  /** Page ID for accessibility */
  pageId?: string;
  /** Component ID for accessibility */
  componentId?: string;
  /** Additional className for the container */
  className?: string;
  /** Callback when preview is closed - receives updated URL list with renderPreview set to false */
  onClose?: (urls: UrlHighlight[]) => void;
  /** Callback when link retention state changes - provides debouncedFirstUrl and hiddenPreviewUrl for post creation */
  onLinkRetentionChange?: (state: LinkRetentionState) => void;
}

export function TextEditorLinkPreview({
  pageId = '*',
  componentId = '*',
  className,
  urls,
  attachmentAmount = 0,
  isClipPost = false,
  isPollPost = false,
  onPreviewStateChange,
  onClose,
  onLinkRetentionChange,
}: TextEditorLinkPreviewProps) {
  const {
    previewUrl,
    shouldShowPreview,
    isPreviewLoading,
    setIsPreviewLoading,
    hidePreview,
    debouncedFirstUrl,
    hiddenPreviewUrl,
  } = useLinkPreview({
    urls,
    attachmentAmount,
    isClipPost,
    isPollPost,
    onPreviewStateChange,
  });

  // Notify parent when link retention state changes
  useEffect(() => {
    onLinkRetentionChange?.({ debouncedFirstUrl, hiddenPreviewUrl });
  }, [debouncedFirstUrl, hiddenPreviewUrl, onLinkRetentionChange]);

  // Same logic as handleClosePreview in PostTextField
  const handleClosePreview = () => {
    if (debouncedFirstUrl) {
      hidePreview();
      if (onClose) {
        // If urls exist in text, update them with renderPreview: false
        if (urls && urls.length > 0) {
          const updatedUrls = urls.map((url, index) => ({
            ...url,
            renderPreview: index === 0 ? false : url.renderPreview,
          }));
          onClose(updatedUrls);
        } else {
          // Link text was removed but preview is still showing
          // Return the retained URL with index=0, length=0, renderPreview=false
          onClose([
            {
              url: debouncedFirstUrl,
              start: 0,
              end: 0,
              renderPreview: false,
            },
          ]);
        }
      }
    }
  };

  if (!shouldShowPreview || !previewUrl) {
    return null;
  }

  return (
    <div className={clsx(styles.textEditorLinkPreview, className)}>
      <LinkPreview
        pageId={pageId}
        componentId={componentId}
        url={previewUrl}
        onLoadingChange={setIsPreviewLoading}
      />
      {!isPreviewLoading && (
        <CloseButton
          pageId={pageId}
          componentId={componentId}
          className={styles.textEditorLinkPreview__closeButton}
          defaultClassName={styles.textEditorLinkPreview__closeButton__icon}
          onPress={handleClosePreview}
        />
      )}
    </div>
  );
}
