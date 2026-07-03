import useChannelCollection from './useChannelCollection';

type UseChannelsCollectionParams = {
  membership?: 'all' | 'member' | 'notMember';
  sortBy?: 'lastActivity' | 'firstCreated' | 'lastCreated';
  types?: Amity.ChannelType[];
  isDeleted?: boolean;
  limit?: number;
};

export default function useChannelsCollection({
  membership,
  sortBy,
  types,
  isDeleted = false,
  limit,
}: UseChannelsCollectionParams = {}) {
  return useChannelCollection({ membership, sortBy, types, isDeleted, limit });
}
