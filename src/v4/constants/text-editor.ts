import type { EditorContentType } from '~/v4/core/components/TextEditor/TextEditor';

export const DEBOUNCE_DELAY = 300;
export const DEFAULT_MAX_MENTIONS = 30;
export const DEFAULT_MAX_HASHTAGS = 30;
export const DEFAULT_MAX_PRODUCTS = 20;

// Content type defaults
export const CONTENT_TYPE_DEFAULTS: Record<
  EditorContentType,
  {
    maxCharacters: number;
    maxLines: number;
    enableHashtag: boolean;
    enableUrlDetection: boolean;
    placeholderKey: string;
  }
> = {
  post: {
    maxCharacters: 50000,
    maxLines: 30,
    enableHashtag: true,
    enableUrlDetection: true,
    placeholderKey: 'amity_social_placeholder_whats_on_your_mind',
  },
  comment: {
    maxCharacters: 50000,
    maxLines: 6,
    enableHashtag: false,
    enableUrlDetection: false,
    placeholderKey: 'amity_social_write_a_comment',
  },
  message: {
    maxCharacters: 200,
    maxLines: 1,
    enableHashtag: false,
    enableUrlDetection: false,
    placeholderKey: 'amity_social_type_a_message',
  },
};
