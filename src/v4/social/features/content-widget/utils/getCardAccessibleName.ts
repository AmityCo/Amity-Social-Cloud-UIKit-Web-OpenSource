import { MEDIA_DATA_TYPES } from '~/v4/social/features/content-widget/constants';
import type { ContentWidgetCardVariant } from './resolveCardVariant';

const MAX_LABEL_CHARS = 120;

export type CardTypeWords = {
  photo: string;
  video: string;
  clip: string;
  poll: string;
};

function truncateForLabel(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= MAX_LABEL_CHARS) return trimmed;
  return trimmed.slice(0, MAX_LABEL_CHARS).replace(/\s+\S*$/, '');
}

function resolveTypeHint(
  post: Amity.Post,
  variant: ContentWidgetCardVariant,
  words: CardTypeWords,
): string {
  if (variant === 'poll') return words.poll;
  if (variant === 'image') return words.photo;
  if (variant === 'video') {
    const firstMedia = (post.childrenPosts ?? []).find((child) =>
      MEDIA_DATA_TYPES.includes(child.dataType),
    );
    return firstMedia?.dataType === 'clip' ? words.clip : words.video;
  }
  return '';
}

export function getCardAccessibleName(
  post: Amity.Post,
  variant: ContentWidgetCardVariant,
  words: CardTypeWords,
): string {
  const data = (post.data as { title?: string; text?: string } | undefined) ?? {};
  const creator = post.creator?.displayName ?? '';
  const content = truncateForLabel(data.title || data.text || '');
  const typeHint = resolveTypeHint(post, variant, words);

  return [creator, content, typeHint].filter(Boolean).join(', ');
}
