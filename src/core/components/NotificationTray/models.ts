export type NotificationRecord = {
  description: string;
  userId: string;
  verb: string;
  targetId: string;
  targetGroup: string;
  targetType: string;
  imageUrl?: string;
  hasRead?: boolean;
  lastUpdate: number;
  actors?: { id: string; name: string }[];
};
