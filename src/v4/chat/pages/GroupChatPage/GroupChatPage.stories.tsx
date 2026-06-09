import { GroupChatPage } from './GroupChatPage';

export default {
  title: 'v4/chat/pages/GroupChatPage',
};

export const GroupChatPageStory = {
  name: 'GroupChatPage',
  render: () => <GroupChatPage channelId="demo-group-channel" />,
};
