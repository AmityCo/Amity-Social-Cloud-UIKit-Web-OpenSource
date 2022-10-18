export const mockNotificationRecordPost = {
  description: 'John Doe, Sara Janes and 10 others posted in Summer Collection community',
  userId: 'TEST1337',
  verb: 'post',
  targetId: '634678647e482b00d99e9fe3',
  targetGroup: '1660634491595',
  targetType: 'community',
  imageUrl: undefined,
  hasRead: false,
  lastUpdate: Date.now() - 20 * 1000,
  actors: [
    {
      name: 'John Doe',
      id: 'TEST1234',
    },
    {
      name: 'Sara Janes',
      id: 'TEST1256',
    },
  ],
};

export const mockNotificationRecordLike = {
  description: 'Sara Janes likes your post in Noomers over 50',
  userId: 'TEST1337',
  verb: 'like',
  targetId: '634678647e482b00d43e9fe3',
  targetGroup: '1660634491595',
  targetType: 'community',
  imageUrl: undefined,
  hasRead: false,
  lastUpdate: Date.now() - 58 * 1000,
  actors: [
    {
      name: 'Sara Janes',
      id: 'TEST1256',
    },
  ],
};

export const mockNotificationRecordComment = {
  description: 'John Doe commented on your post in  in Noom bites',
  userId: 'TEST1337',
  verb: 'comment',
  targetId: '634678647e482re0d43e9fe3',
  targetGroup: '1660634491595',
  targetType: 'community',
  imageUrl: undefined,
  hasRead: false,
  lastUpdate: Date.now() - 300 * 1000,
  actors: [
    {
      name: 'John Doe',
      id: 'TEST1234',
    },
  ],
};
