import { PostRepository } from '@amityco/ts-sdk';
import promisify from '~/helpers/promisify';

export const MAX_IMAGES = 10;
export const MAX_FILES = 10;

export const getAuthorId = ({ communityId, userId }: Author) => communityId || userId;

type Author = { communityId: string; userId: string };

export const isIdenticalAuthor = (a: Author, b: Author) =>
  !!getAuthorId(a) && getAuthorId(a) === getAuthorId(b);

type CreatePostParams = Parameters<typeof PostRepository.createPost>[0];

export async function createPost({
  targetId,
  targetType,
  data,
  dataType,
  attachments,
  mentionees,
  metadata,
}: CreatePostParams) {
  return promisify(
    PostRepository.createPost({
      targetId,
      targetType,
      data,
      dataType,
      attachments,
      mentionees,
      metadata,
    }),
  );
}
