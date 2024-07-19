import { CommentRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

type useCommentsParams = {
  parentId?: string | null;
  referenceId?: string | null;
  referenceType: Amity.CommentReferenceType;
  limit?: number;
  shouldCall?: () => boolean;
  includeDeleted?: boolean;
};

export default function useCommentsCollection({
  parentId,
  referenceId,
  referenceType,
  limit = 10,
  shouldCall = () => true,
  includeDeleted = false,
}: useCommentsParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommentRepository.getComments,
    params: {
      parentId,
      referenceId: referenceId as string,
      referenceType,
      limit,
      includeDeleted,
    },
    shouldCall: () => shouldCall() && !!referenceId && !!referenceType,
  });

  return {
    comments: items,
    ...rest,
  };
}
