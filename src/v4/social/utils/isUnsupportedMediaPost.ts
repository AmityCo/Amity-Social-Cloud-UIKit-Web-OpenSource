import { PostStructureType } from '@amityco/ts-sdk';

const UNSUPPORTED_STRUCTURE_TYPES: string[] = [
  PostStructureType.AUDIO,
  PostStructureType.FILE,
  PostStructureType.MIXED,
  PostStructureType.GIF,
];

const UNSUPPORTED_CHILD_DATA_TYPES = ['audio', 'file', 'gif'];

export const isUnsupportedMediaPost = (post?: Amity.Post | null) => {
  if (!post) return false;
  if (UNSUPPORTED_STRUCTURE_TYPES.includes(post.structureType)) return true;

  return (post.childrenPosts ?? []).some(
    (child) => child && UNSUPPORTED_CHILD_DATA_TYPES.includes(child.dataType),
  );
};

export const withoutUnsupportedMediaPosts = (posts: Amity.Post[]) =>
  posts.filter((post) => !isUnsupportedMediaPost(post));
