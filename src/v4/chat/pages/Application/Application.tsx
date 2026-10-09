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
      {/*
       * The chat home is the root of the navigation stack (ChatNavigationProvider
       * starts with it) and stays mounted underneath every other page, hidden,
       * the way the iOS navigation stack and the Android activity stack keep
       * their chat home alive. Its channel collections keep their realtime
       * subscriptions, so coming back shows the list as it is instead of
       * re-creating the collection and fetching the first page again. Right
       * after a send that fetch could land before the backend has written the
       * channel's lastMessageAt and preview, and the stale page moved the chat
       * back down the list (PDT-5758).
       */}
      <ChatHomePage hidden={currentPage.type !== ChatPageTypes.ChatHome} />
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
