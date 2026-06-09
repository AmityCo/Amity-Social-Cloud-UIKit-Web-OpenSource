import { CreateGroupChatPage } from './CreateGroupChatPage';

export default {
  title: 'v4/chat/pages/CreateGroupChatPage',
};

export const CreateGroupChatPageStory = {
  name: 'CreateGroupChatPage',
  render: () => <CreateGroupChatPage selectedUsers={[]} />,
};
