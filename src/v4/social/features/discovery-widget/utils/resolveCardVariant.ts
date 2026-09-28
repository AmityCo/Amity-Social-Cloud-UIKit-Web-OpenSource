import { MEDIA_DATA_TYPES } from '~/v4/social/features/discovery-widget/constants';
import { extractFirstPreviewUrl } from '~/v4/utils/previewLink';

export type DiscoveryWidgetCardVariant = 'text' | 'link' | 'image' | 'video' | 'poll';

export function resolveCardVariant(post: Amity.Post): DiscoveryWidgetCardVariant {
  const children = post.childrenPosts ?? [];

  if (children.some((child) => child.dataType === 'poll')) return 'poll';

  const media = children.find((child) => MEDIA_DATA_TYPES.includes(child.dataType));

  if (media) return media.dataType === 'image' ? 'image' : 'video';

  const text = (post.data as { text?: string })?.text ?? '';

  if (extractFirstPreviewUrl(text)) return 'link';

  return 'text';
}
