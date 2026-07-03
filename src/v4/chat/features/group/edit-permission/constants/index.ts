import { AmityChannelMessagingPermissionEnum } from '~/v4/chat/hooks/queries';

export const MESSAGING_PERMISSIONS = [
  {
    value: AmityChannelMessagingPermissionEnum.Everyone,
    titleKey: 'amity_chat_group_edit_permissions_everyone_title',
    descriptionKey: 'amity_chat_group_edit_permissions_everyone_description',
  },
  {
    value: AmityChannelMessagingPermissionEnum.ModeratorsOnly,
    titleKey: 'amity_chat_group_edit_permissions_moderators_only_title',
    descriptionKey: 'amity_chat_group_edit_permissions_moderators_only_description',
  },
];
