import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ChatPageProps } from '~/v4/chat/pages/ChatPage';
import type { GroupChatPageProps } from '~/v4/chat/pages/GroupChatPage';
import type { SelectGroupMemberPageProps } from '~/v4/chat/pages/SelectGroupMemberPage';
import type { CreateGroupChatPageProps } from '~/v4/chat/pages/CreateGroupChatPage';
import type { GroupSettingPageProps } from '~/v4/chat/pages/GroupSettingPage';
import type { EditGroupProfilePageProps } from '~/v4/chat/pages/EditGroupProfilePage';
import type { EditGroupNotificationPageProps } from '~/v4/chat/pages/EditGroupNotificationPage';
import type { EditGroupMemberPermissionsPageProps } from '~/v4/chat/pages/EditGroupMemberPermissionsPage';
import type { GroupNotificationPreferencePageProps } from '~/v4/chat/pages/GroupNotificationPreferencePage';
import type { GroupMemberListPageProps } from '~/v4/chat/pages/GroupMemberListPage';
import type { AddGroupMemberPageProps } from '~/v4/chat/pages/AddGroupMemberPage';
import type { BannedGroupMemberListPageProps } from '~/v4/chat/pages/BannedGroupMemberListPage';

export const enum ChatPageTypes {
  ChatHome = 'chat_home',
  ChatPage = 'chat_page',
  GroupChatPage = 'group_chat_page',
  CreateConversationPage = 'create_conversation_page',
  SelectGroupMemberPage = 'select_group_member_page',
  CreateGroupChatPage = 'create_group_chat_page',
  GroupSettingPage = 'group_setting_page',
  EditGroupProfilePage = 'edit_group_profile_page',
  EditGroupNotificationPage = 'edit_group_notification_page',
  EditGroupMemberPermissionsPage = 'edit_group_member_permissions_page',
  GroupNotificationPreferencePage = 'group_notification_preference_page',
  GroupMemberListPage = 'group_member_list_page',
  AddGroupMemberPage = 'add_group_member_page',
  BannedGroupMemberListPage = 'banned_group_member_list_page',
  ArchivedChatPage = 'archived_chat_page',
  SearchChannelPage = 'search_channel_page',
}

export type ChatPage =
  | { type: ChatPageTypes.ChatHome }
  | {
      type: ChatPageTypes.ChatPage;
      context: ChatPageProps;
    }
  | {
      type: ChatPageTypes.GroupChatPage;
      context: GroupChatPageProps;
    }
  | { type: ChatPageTypes.CreateConversationPage }
  | {
      type: ChatPageTypes.SelectGroupMemberPage;
      context?: SelectGroupMemberPageProps;
    }
  | {
      type: ChatPageTypes.CreateGroupChatPage;
      context: CreateGroupChatPageProps;
    }
  | {
      type: ChatPageTypes.GroupSettingPage;
      context: GroupSettingPageProps;
    }
  | {
      type: ChatPageTypes.EditGroupProfilePage;
      context: EditGroupProfilePageProps;
    }
  | {
      type: ChatPageTypes.EditGroupNotificationPage;
      context: EditGroupNotificationPageProps;
    }
  | {
      type: ChatPageTypes.EditGroupMemberPermissionsPage;
      context: EditGroupMemberPermissionsPageProps;
    }
  | {
      type: ChatPageTypes.GroupNotificationPreferencePage;
      context: GroupNotificationPreferencePageProps;
    }
  | {
      type: ChatPageTypes.GroupMemberListPage;
      context: GroupMemberListPageProps;
    }
  | {
      type: ChatPageTypes.AddGroupMemberPage;
      context: AddGroupMemberPageProps;
    }
  | {
      type: ChatPageTypes.BannedGroupMemberListPage;
      context: BannedGroupMemberListPageProps;
    }
  | { type: ChatPageTypes.ArchivedChatPage }
  | { type: ChatPageTypes.SearchChannelPage };

type ChatNavigationContextValue = {
  currentPage: ChatPage;
  push: (page: ChatPage) => void;
  pop: () => void;
  replace: (page: ChatPage) => void;
};

const defaultValue: ChatNavigationContextValue = {
  currentPage: { type: ChatPageTypes.ChatHome },
  push: () => {},
  pop: () => {},
  replace: () => {},
};

export const ChatNavigationContext = createContext<ChatNavigationContextValue>(defaultValue);

export function ChatNavigationProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<ChatPage[]>([{ type: ChatPageTypes.ChatHome }]);

  const push = useCallback((page: ChatPage) => {
    setStack((prev) => [...prev, page]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const replace = useCallback((page: ChatPage) => {
    setStack((prev) => [...prev.slice(0, -1), page]);
  }, []);

  const currentPage = stack[stack.length - 1];

  const value = useMemo(
    () => ({ currentPage, push, pop, replace }),
    [currentPage, push, pop, replace],
  );

  return <ChatNavigationContext.Provider value={value}>{children}</ChatNavigationContext.Provider>;
}

export function useChatNavigation(): ChatNavigationContextValue {
  const context = useContext(ChatNavigationContext);
  if (!context) throw new Error('useChatNavigation must be used inside ChatNavigationProvider');
  return context;
}
