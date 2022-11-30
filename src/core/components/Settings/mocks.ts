import { NotificationSettings } from './models';

export const settings: NotificationSettings = {
  community: [
    {
      isEnabled: true,
      communityId: '62e9a37dcc489500d965db40',
      communityName: 'Announcements',
    },
    {
      isEnabled: true,
      communityId: '62e9a37dcc489500d965db41',
      communityName: 'Noom Bites',
    },
    {
      isEnabled: true,
      communityId: '62e9a37dcc489500d965db43',
      communityName: 'Exercises',
    },
    {
      isEnabled: true,
      communityId: '62e9a37dcc489500d965db44',
      communityName: 'Fun club',
    },
    {
      isEnabled: true,
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
