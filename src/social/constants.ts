export const enum PageTypes {
  Explore = 'explore',
  Category = 'category',
  NewsFeed = 'newsfeed',
  UserFeed = 'userfeed',
  CommunityFeed = 'communityfeed',
  CommunityEdit = 'communityedit',
  UserEdit = 'useredit',
  ViewStory = 'viewstory',
  DraftPage = 'draftpage',
}

export const MemberRoles = Object.freeze({
  MEMBER: 'member',
  MODERATOR: 'moderator',
  SUPER_MODERATOR: 'super-moderator',
  COMMUNITY_MODERATOR: 'community-moderator',
  CHANNEL_MODERATOR: 'channel-moderator',
});

export const Permissions = Object.freeze({
  EditUserPermission: 'EDIT_USER',
  BanUserPermission: 'BAN_USER',
  CreateRolePermission: 'CREATE_ROLE',
  EditRolePermission: 'EDIT_ROLE',
  DeleteRolePermission: 'DELETE_ROLE',
  AssignRolePermission: 'ASSIGN_USER_ROLE',
  EditChannelPermission: 'EDIT_CHANNEL',
  EditChannelRatelimitPermission: 'EDIT_CHANNEL_RATELIMIT',
  MuteChannelPermission: 'MUTE_CHANNEL',
  CloseChannelPermission: 'CLOSE_CHANNEL',
  AddChannelUserPermission: 'ADD_CHANNEL_USER',
  EditChannelUserPermission: 'EDIT_CHANNEL_USER',
  RemoveChannelUserPermission: 'REMOVE_CHANNEL_USER',
  MuteChannelUserPermission: 'MUTE_CHANNEL_USER',
  BanChannelUserPermission: 'BAN_CHANNEL_USER',
  EditMessagePermission: 'EDIT_MESSAGE',
  DeleteMessagePermission: 'DELETE_MESSAGE',
  EditCommunityPermission: 'EDIT_COMMUNITY',
  DeleteCommunityPermission: 'DELETE_COMMUNITY',
  AddChannelCommunityPermission: 'ADD_COMMUNITY_USER',
  EditChannelCommunityPermission: 'EDIT_COMMUNITY_USER',
  RemoveChannelCommunityPermission: 'REMOVE_COMMUNITY_USER',
  MuteChannelCommunityPermission: 'MUTE_COMMUNITY_USER',
  BanChannelCommunityPermission: 'BAN_COMMUNITY_USER',
  EditUserFeedPostPermission: 'EDIT_USER_FEED_POST',
  DeleteUserFeedPostPermission: 'DELETE_USER_FEED_POST',
  EditUserFeedCommentPermission: 'EDIT_USER_FEED_COMMENT',
  DeleteUserFeedCommentPermission: 'DELETE_USER_FEED_COMMENT',
  EditCommunityFeedPostPermission: 'EDIT_COMMUNITY_FEED_POST',
  DeleteCommunityFeedPostPermission: 'DELETE_COMMUNITY_FEED_POST',
  EditCommunityFeedCommentPermission: 'EDIT_COMMUNITY_FEED_COMMENT',
  DeleteCommunityFeedCommentPermission: 'DELETE_COMMUNITY_FEED_COMMENT',
  CreateCommunityCategoryPermission: 'CREATE_COMMUNITY_CATEGORY',
  EditCommunityCategoryPermission: 'EDIT_COMMUNITY_CATEGORY',
  DeleteCommunityCategoryPermission: 'DELETE_COMMUNITY_CATEGORY',
  ManageStoryPermission: 'MANAGE_COMMUNITY_STORY',
});

export const MAXIMUM_MENTIONEES = 30;

export const VideoFileStatus = Object.freeze({
  Uploaded: 'uploaded',
  Transcoding: 'transcoding',
  Transcoded: 'transcoded',
  TranscodeFailed: 'transcodeFailed',
});

export const VideoQuality = Object.freeze({
  FHD: '1080p',
  HD: '720p',
  SD: '480p',
  LD: '360p',
  Original: 'original',
});

export const MP4MimeType = 'video/mp4';

export const ERROR_RESPONSE = Object.freeze({
  CONTAIN_BLOCKED_WORD: 'Amity SDK (400308): Text contain blocked word',
  NOT_INCLUDE_WHITELIST_LINK: 'Data contains a link that is not in the whitelist',
  CONTAIN_BLOCKLISTED_WORD: 'Your text contains a blocklisted word.',
});
