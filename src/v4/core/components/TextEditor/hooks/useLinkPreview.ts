import { useState, useEffect, useMemo, useCallback } from 'react';

export interface UrlHighlight {
  url: string;
  start: number;
  end: number;
  renderPreview: boolean;
}

const DEBOUNCE_PREVIEW_LINK = 2000;

export interface UseLinkPreviewOptions {
  /** URL highlights from the text editor */
  urls?: UrlHighlight[];
  /** Number of attachments - hide preview if there are attachments */
  attachmentAmount?: number;
  /** Whether this is a clip post - hide preview for clip posts */
  isClipPost?: boolean;
  /** Whether this is a poll post - hide preview for poll posts */
  isPollPost?: boolean;
  /** Callback when preview state changes */
  onPreviewStateChange?: (showPreview: boolean, isLoading?: boolean) => void;
}

export interface UseLinkPreviewResult {
  /** The URL to show preview for (debounced) */
  previewUrl: string | null;
  /** Whether to show the link preview */
  shouldShowPreview: boolean;
  /** Whether the preview is loading */
  isPreviewLoading: boolean;
  /** Set loading state for the preview */
  setIsPreviewLoading: (loading: boolean) => void;
  /** Hide the current preview */
  hidePreview: () => void;
  /** The debounced first URL - used for link retention when text is removed */
  debouncedFirstUrl: string | null;
  /** The hidden preview URL - URL that user manually dismissed */
  hiddenPreviewUrl: string | null;
}

export function useLinkPreview({
  urls,
  attachmentAmount = 0,
  isClipPost = false,
  isPollPost = false,
  onPreviewStateChange,
}: UseLinkPreviewOptions): UseLinkPreviewResult {
  const [hiddenPreviewUrl, setHiddenPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Find the first URL that has renderPreview: true
  const firstUrl = useMemo(() => {
    if (urls && urls.length > 0) {
      const firstLinkWithPreview = urls.find((url) => url.renderPreview === true);
      return firstLinkWithPreview?.url ?? null;
    }
    return null;
  }, [urls]);

  const firstLinkRenderPreview = useMemo(() => {
    if (urls && urls.length > 0) {
      const firstLinkWithPreview = urls.find((url) => url.renderPreview === true);
      return !!firstLinkWithPreview;
    }
    return true;
  }, [urls]);

  // Initialize debouncedFirstUrl with the first link that has renderPreview: true
  const [debouncedFirstUrl, setDebouncedFirstUrl] = useState<string | null>(() => {
    if (urls && urls.length > 0) {
      const firstLinkWithPreview = urls.find((url) => url.renderPreview === true);
      return firstLinkWithPreview?.url ?? null;
    }
    return null;
  });

  // Debounce the URL changes - but DON'T clear debouncedFirstUrl when firstUrl becomes null
  // This keeps the preview visible even when link text is removed (Requirement 4)
  useEffect(() => {
    // Only update if there's a new URL (not null)
    // When firstUrl becomes null (link removed), we keep the existing debouncedFirstUrl
    if (firstUrl !== null) {
      const timer = setTimeout(() => {
        setDebouncedFirstUrl(firstUrl);
      }, DEBOUNCE_PREVIEW_LINK);

      return () => clearTimeout(timer);
    }
  }, [firstUrl]);

  // Reset hidden preview when the debounced URL changes to a different URL
  useEffect(() => {
    if (debouncedFirstUrl && hiddenPreviewUrl && debouncedFirstUrl !== hiddenPreviewUrl) {
      setHiddenPreviewUrl(null);
    }
  }, [debouncedFirstUrl, hiddenPreviewUrl]);

  // Clear debouncedFirstUrl when attachments are added (Requirement 5)
  useEffect(() => {
    if (attachmentAmount > 0 && debouncedFirstUrl) {
      setDebouncedFirstUrl(null);
    }
  }, [attachmentAmount]);

  // Determine if we should show link preview
  // Show if: valid debounced URL, no attachments, not hidden, not clip/poll post
  // Note: firstLinkRenderPreview is only checked when urls exist, otherwise we keep showing retained preview
  const shouldShowPreview = useMemo(() => {
    const hasUrlsInText = urls && urls.length > 0;

    return !!(
      debouncedFirstUrl &&
      !attachmentAmount &&
      debouncedFirstUrl !== hiddenPreviewUrl &&
      (hasUrlsInText ? firstLinkRenderPreview : true) && // If no urls in text, still show preview
      !isClipPost &&
      !isPollPost
    );
  }, [
    debouncedFirstUrl,
    attachmentAmount,
    hiddenPreviewUrl,
    firstLinkRenderPreview,
    isClipPost,
    isPollPost,
    urls,
  ]);

  // Notify parent component when preview state changes
  useEffect(() => {
    onPreviewStateChange?.(shouldShowPreview, isPreviewLoading);
  }, [shouldShowPreview, isPreviewLoading, onPreviewStateChange]);

  // Hide the current preview - same as handleClosePreview in PostTextField
  const hidePreview = useCallback(() => {
    if (debouncedFirstUrl) {
      setHiddenPreviewUrl(debouncedFirstUrl);
    }
  }, [debouncedFirstUrl]);

  return {
    previewUrl: debouncedFirstUrl,
    shouldShowPreview,
    isPreviewLoading,
    setIsPreviewLoading,
    hidePreview,
    debouncedFirstUrl,
    hiddenPreviewUrl,
  };
}
