import {
  MEDIA_DATA_TYPES,
  UNSUPPORTED_DATA_TYPES,
} from '~/v4/social/features/content-widget/constants';

export function isValidPostType(post: Amity.Post): boolean {
  const children = post.childrenPosts ?? [];

  const pollChild = children.find((child) => child.dataType === 'poll') as
    | Amity.Post<'poll'>
    | undefined;

  if (pollChild) return !!pollChild.getPollInfo();

  if (children.some((child) => MEDIA_DATA_TYPES.includes(child.dataType))) return true;

  if (children.some((child) => UNSUPPORTED_DATA_TYPES.includes(child.dataType))) return false;

  return post.dataType === 'text';
}
