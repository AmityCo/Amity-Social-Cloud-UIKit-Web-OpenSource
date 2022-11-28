import { NotificationSettings } from './models';

export const settings: NotificationSettings = {
  community: [
    {
      enabled: true,
      communityId: '62e9a37dcc489500d965db40',
      communityName: 'Announcements',
    },
    {
      enabled: true,
      communityId: '62e9a37dcc489500d965db41',
      communityName: 'Noom Bites',
    },
    {
      enabled: true,
      communityId: '62e9a37dcc489500d965db43',
      communityName: 'Exercises',
    },
    {
      enabled: true,
      communityId: '62e9a37dcc489500d965db44',
      communityName: 'Fun club',
    },
    {
      enabled: true,
      communityId: '62e9a37dcc489500d965db415',
      communityName: 'Noom fun times with a very long name to check',
    },
  ],
  global: {
    comment: false,
    reaction: false,
    post: true,
  },
};
