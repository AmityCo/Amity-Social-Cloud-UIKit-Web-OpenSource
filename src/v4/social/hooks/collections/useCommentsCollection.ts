import { CommentRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { usePaginator } from '~/v4/core/hooks/usePaginator';

type useCommentsParams = {
  parentId?: string | null;
  referenceId?: string | null;
  referenceType: Amity.CommentReferenceType;
  sortBy?: 'lastCreated' | 'firstCreated';
  shouldCall?: boolean;
  includeDeleted?: boolean;
  pageSize?: number;
};

export default function useCommentsCollection({
  parentId,
  referenceId,
  referenceType,
  sortBy,
  shouldCall = true,
  includeDeleted = false,
  pageSize = 10,
}: useCommentsParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: CommentRepository.getComments,
    params: {
      parentId,
      referenceId: referenceId as string,
      referenceType,
      sortBy,
      includeDeleted,
      pageSize,
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
  sortBy,
  shouldCall = true,
  includeDeleted = false,
  pageSize = 10,
}: useCommentsParams) {
  const { items, ...rest } = usePaginator({
    fetcher: CommentRepository.getComments,
    params: {
      parentId,
      referenceId: referenceId as string,
      referenceType,
      sortBy,
      includeDeleted,
      pageSize,
    },
    shouldCall: shouldCall && !!referenceId && !!referenceType,
    getItemId: (item) => item.commentId,
    pageSize,
    placement: 'comment' as Amity.AdPlacement,
  });

  return {
    comments: items,
    ...rest,
  };
}
