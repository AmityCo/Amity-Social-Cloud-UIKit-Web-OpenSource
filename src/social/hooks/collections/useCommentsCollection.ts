import { CommentRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

type useCommentsParams = {
  parentId?: string | null;
  referenceId?: string | null;
  referenceType: Amity.CommentReferenceType;
  limit?: number;
  shouldCall?: () => boolean;
  // breaking changes
  // first?: number;
  // last?: number;
};

export default function useCommentsCollection({
  parentId,
  referenceId,
  referenceType,
  limit = 10,
  shouldCall = () => true,
}: useCommentsParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommentRepository.getComments,
    params: {
      parentId,
      referenceId: referenceId as string,
      referenceType,
      limit,
    },
    shouldCall: () => shouldCall() && !!referenceId && !!referenceType,
  });

  return {
    comments: items,
    ...rest,
  };
}
