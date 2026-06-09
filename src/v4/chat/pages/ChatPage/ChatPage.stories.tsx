import { ChatPage } from './ChatPage';

export default {
  title: 'v4/chat/pages/ChatPage',
};

export const ChatPageStory = {
  name: 'ChatPage',
  render: () => <ChatPage channelId="demo-channel" userDisplayName="Demo User" />,
};
