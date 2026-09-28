export type MentionMetadata = {
  mentioned?: { index: number; length: number; type?: 'user' | 'channel'; userId?: string }[];
};

export type SeeMorePayload = {
  text: string;
  title?: string;
  metadata?: MentionMetadata | null;
  mentionees?: Amity.Message['mentionees'];
};
