export type CommunitySetting = {
  communityId: string;
  communityName: string;
  enabled: boolean;
};

export type NotificationSettings = {
  community: CommunitySetting[];
  global: {
    comment: boolean;
    post: boolean;
    reaction: boolean;
  };
};
