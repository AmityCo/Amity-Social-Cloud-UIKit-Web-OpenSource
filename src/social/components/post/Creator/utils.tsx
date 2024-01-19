import { PostRepository } from '@amityco/ts-sdk';
import { notification } from '~/core/components/Notification';
import promisify from '~/helpers/promisify';

export const MAX_IMAGES = 10;
export const MAX_FILES = 10;

export const getAuthorId = ({ communityId, userId }: Author) => communityId || userId;

type Author = { communityId: string; userId: string };

export const isIdenticalAuthor = (a: Author, b: Author) =>
  !!getAuthorId(a) && getAuthorId(a) === getAuthorId(b);

export const maxImagesWarning = () =>
  notification.info({
    content: 'You reached the maximum attachment of 10',
  });

export const maxFilesWarning = () =>
  notification.info({
    content: 'The selected file is larger than 1GB. Please select a new file. ',
  });

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
