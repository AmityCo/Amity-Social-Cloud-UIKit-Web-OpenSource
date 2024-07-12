import { CommentRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { usePaginator } from '~/v4/core/hooks/usePaginator';

type useCommentsParams = {
  parentId?: string | null;
  referenceId?: string | null;
  referenceType: Amity.CommentReferenceType;
  limit?: number;
  shouldCall?: boolean;
  includeDeleted?: boolean;
};

export default function useCommentsCollection({
  parentId,
  referenceId,
  referenceType,
  limit = 10,
  shouldCall = true,
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
    shouldCall: !!referenceId && !!referenceType && shouldCall,
  });

  return {
    comments: items,
    ...rest,
  };
}

export function useCommentsCollectionWithAds({
  parentId,
  referenceId,
  referenceType,
  limit = 10,
  shouldCall = true,
  includeDeleted = false,
}: useCommentsParams) {
  const { items, ...rest } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      parentId,
      referenceId: referenceId as string,
      referenceType,
      limit,
      includeDeleted,
    },
    shouldCall: shouldCall && !!referenceId && !!referenceType,
    getItemId: (item) => item.commentId,
    pageSize: limit,
    placement: 'comment' as Amity.AdPlacement,
  });

  return {
    comments: items,
    ...rest,
  };
}
