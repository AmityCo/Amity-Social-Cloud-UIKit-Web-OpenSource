import {
  ChatNavigationProvider,
  ChatPageTypes,
  useChatNavigation,
} from '~/v4/chat/providers/ChatNavigationProvider';
import { ChatSearchProvider } from '~/v4/chat/providers/ChatSearchProvider';
import { ChatHomePage } from '~/v4/chat/pages/ChatHomePage/ChatHomePage';
import { ChannelCreateConversationPage } from '~/v4/chat/pages/ChannelCreateConversationPage/ChannelCreateConversationPage';
import { SelectGroupMemberPage } from '~/v4/chat/pages/SelectGroupMemberPage/SelectGroupMemberPage';
import { CreateGroupChatPage } from '~/v4/chat/pages/CreateGroupChatPage/CreateGroupChatPage';
import { ChatPage } from '~/v4/chat/pages/ChatPage/ChatPage';
import { GroupChatPage } from '~/v4/chat/pages/GroupChatPage/GroupChatPage';
import { GroupSettingPage } from '~/v4/chat/pages/GroupSettingPage/GroupSettingPage';
import { EditGroupProfilePage } from '~/v4/chat/pages/EditGroupProfilePage/EditGroupProfilePage';
import { EditGroupNotificationPage } from '~/v4/chat/pages/EditGroupNotificationPage/EditGroupNotificationPage';
import { EditGroupMemberPermissionsPage } from '~/v4/chat/pages/EditGroupMemberPermissionsPage/EditGroupMemberPermissionsPage';
import { GroupNotificationPreferencePage } from '~/v4/chat/pages/GroupNotificationPreferencePage/GroupNotificationPreferencePage';
import { GroupMemberListPage } from '~/v4/chat/pages/GroupMemberListPage/GroupMemberListPage';
import { AddGroupMemberPage } from '~/v4/chat/pages/AddGroupMemberPage/AddGroupMemberPage';
import { BannedGroupMemberListPage } from '~/v4/chat/pages/BannedGroupMemberListPage/BannedGroupMemberListPage';
import { ArchivedChatPage } from '~/v4/chat/pages/ArchivedChatPage/ArchivedChatPage';
import { SearchChannelPage } from '~/v4/chat/pages/SearchChannelPage';

function ChatUIKit() {
  const { currentPage } = useChatNavigation();

  return (
    <>
      {currentPage.type === ChatPageTypes.ChatHome && <ChatHomePage />}
      {currentPage.type === ChatPageTypes.CreateConversationPage && (
        <ChannelCreateConversationPage />
      )}
      {currentPage.type === ChatPageTypes.SelectGroupMemberPage && (
        <SelectGroupMemberPage selectedGroupMember={currentPage.context?.selectedGroupMember} />
      )}
      {currentPage.type === ChatPageTypes.CreateGroupChatPage && (
        <CreateGroupChatPage selectedUsers={currentPage.context.selectedUsers} />
      )}
      {currentPage.type === ChatPageTypes.ChatPage && <ChatPage {...currentPage.context} />}
      {currentPage.type === ChatPageTypes.GroupChatPage && (
        <GroupChatPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.GroupSettingPage && (
        <GroupSettingPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.EditGroupProfilePage && (
        <EditGroupProfilePage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.EditGroupNotificationPage && (
        <EditGroupNotificationPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.EditGroupMemberPermissionsPage && (
        <EditGroupMemberPermissionsPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.GroupNotificationPreferencePage && (
        <GroupNotificationPreferencePage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.GroupMemberListPage && (
        <GroupMemberListPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.AddGroupMemberPage && (
        <AddGroupMemberPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.BannedGroupMemberListPage && (
        <BannedGroupMemberListPage {...currentPage.context} />
      )}
      {currentPage.type === ChatPageTypes.ArchivedChatPage && <ArchivedChatPage />}
      {currentPage.type === ChatPageTypes.SearchChannelPage && <SearchChannelPage />}
    </>
  );
}

export function Application() {
  return (
    <ChatNavigationProvider>
      <ChatSearchProvider>
        <ChatUIKit />
      </ChatSearchProvider>
    </ChatNavigationProvider>
  );
}
