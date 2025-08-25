import { generateShades } from '~/v4/core/providers/ThemeProvider';

export type IconConfiguration = {
  icon?: string;
  image?: string;
};

export type TextConfiguration = {
  text?: string;
};

export type CustomConfiguration = {
  [key: string]: string | undefined | boolean | Array<string> | number | Record<string, unknown>;
};

export type ThemeConfiguration = {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Partial<Theme['light']>;
    dark?: Partial<Theme['dark']>;
  };
};

export type ConfigurableThemeValue = {
  primary_color: string;
  secondary_color: string;
  secondary_shade1_color: string;
  secondary_shade2_color: string;
  secondary_shade3_color: string;
  secondary_shade4_color: string;
  base_color: string;
  base_shade1_color: string;
  base_shade2_color: string;
  base_shade3_color: string;
  base_shade4_color: string;
  base_shade5_color: string;
  alert_color: string;
  background_color: string;
  base_inverse_color: string;
  header_background_color: string;
};

export type Theme = {
  light: ConfigurableThemeValue;
  dark: ConfigurableThemeValue;
};

export type GetConfigReturnValue = IconConfiguration &
  TextConfiguration &
  ThemeConfiguration &
  CustomConfiguration;

export type DefaultConfig = {
  preferred_theme: 'light' | 'dark' | 'default';
  theme: {
    light: Theme['light'];
    dark: Theme['dark'];
  };
  excludes: string[];
  customizations?: {
    [key: string]: GetConfigReturnValue;
  };
};

type BaseThemeValue = {
  background_shade1_color: string;
  live_color: string;
  black_color: string;
  white_color: string;
  highlight_color: string;
  message_bubble_primary_color: string;
  message_bubble_secondary_color: string;
  background_transparent_black_color: string;
  background_transparent_white_color: string;
  primary_background_hover_color: string;
  primary_background_pressed_color: string;
  primary_background_disabled_color: string;
  plyr_color_main: string;
  plyr_video_control_background_hover: string;
  transparent_black: string;
};

type GeneratedThemeValue = {
  primary_shade1_color: string;
  primary_shade2_color: string;
  primary_shade3_color: string;
  primary_shade4_color: string;
};

export type ThemeValue = ConfigurableThemeValue & BaseThemeValue & GeneratedThemeValue;

const defaultBase = {
  black_color: '#000000',
  white_color: '#FFFFFF',
  live_color: '#ff305a',
  highlight_color: '#0b7d3e',
  background_transparent_black_color: '#00000080',
  background_transparent_white_color: '#fffFFFc',
  message_bubble_primary_color: '#0b7d3e',
  primary_background_hover_color: '#00653b',
  primary_background_pressed_color: '#00653b',
  primary_background_disabled_color: '#e6f2eb',
  plyr_color_main: '#f6f7f8',
  plyr_video_control_background_hover: 'rgb(0 0 0 / 30%)',
  transparent_black: 'rgb(0 0 0 / 50%)',
};

export const defaultBaseThemeValue: { dark: BaseThemeValue; light: BaseThemeValue } = {
  dark: {
    background_shade1_color: '#40434e',
    message_bubble_secondary_color: '#292b32',
    ...defaultBase,
  },
  light: {
    background_shade1_color: '#f6f7f8',
    message_bubble_secondary_color: '#ebecef',
    ...defaultBase,
  },
};

export const defaultConfig: DefaultConfig = {
  preferred_theme: 'default',
  theme: {
    light: {
      primary_color: '#bed62f',
      alert_color: '#e32219',

      secondary_color: '#222222',
      secondary_shade1_color: '#4e4e4e',
      secondary_shade2_color: '#909090',
      secondary_shade3_color: '#d3d3d3',
      secondary_shade4_color: '#f2f2f2',

      base_color: '#222222',
      base_shade1_color: '#4e4e4e',
      base_shade2_color: '#909090',
      base_shade3_color: '#d3d3d3',
      base_shade4_color: '#f2f2f2',
      base_shade5_color: '#f8f8f8',

      background_color: '#FFFFFF',
      base_inverse_color: '#222222',
      header_background_color: '#2F3C43',
    },
    dark: {
      primary_color: '#bed62f',
      alert_color: '#e32219',

      secondary_color: '#fcfcfc',
      secondary_shade1_color: '#d3d3d3',
      secondary_shade2_color: '#909090',
      secondary_shade3_color: '#4e4e4e',
      secondary_shade4_color: '#262c2f',

      base_color: '#fcfcfc',
      base_shade1_color: '#d3d3d3',
      base_shade2_color: '#909090',
      base_shade3_color: '#4e4e4e',
      base_shade4_color: '#262c2f',
      base_shade5_color: '#f8f8f8',

      background_color: '#222222',
      base_inverse_color: '#FFFFFF',
      header_background_color: '#2F3C43',
    },
  },
  excludes: [],
  customizations: {
    'select_target_page/*/*': {
      theme: {},
      title: 'Share to',
    },
    'select_target_page/*/back_button': {
      back_icon: 'back.png',
    },
    'camera_page/*/*': {
      resolution: '720p',
    },
    'camera_page/*/close_button': {
      close_icon: 'close.png',
    },
    'create_story_page/*/*': {},
    'create_story_page/*/back_button': {
      image: 'back.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/aspect_ratio_button': {
      aspect_ratio_icon: 'aspect_ratio.png',
      background_color: '1234DB',
    },
    'create_story_page/*/story_hyperlink_button': {
      hyperlink_button_icon: 'hyperlink_button.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/hyper_link': {
      hyper_link_icon: 'hyper_link.png',
      background_color: '#1234DB',
    },
    'create_story_page/*/share_story_button': {
      share_icon: 'share_story_button.png',
      background_color: '#1234DB',
      hide_avatar: false,
    },
    'story_page/*/*': {},
    'story_page/*/progress_bar': {
      progress_color: '#UD1234',
      background_color: '#AB1234',
    },
    'story_page/*/overflow_menu': {
      overflow_menu_icon: 'threeDot.png',
    },
    'story_page/*/close_button': {
      close_icon: 'close.png',
    },
    'story_page/*/story_impression_button': {
      impression_icon: 'impressionIcon.png',
    },
    'story_page/*/story_comment_button': {
      comment_icon: 'comment.png',
      background_color: '#2b2b2b',
    },
    'story_page/*/story_reaction_button': {
      reaction_icon: 'like.png',
      background_color: '#2b2b2b',
    },
    'story_page/*/create_new_story_button': {
      create_new_story_icon: 'plus.png',
      background_color: '#FFFFFF',
    },
    'story_page/*/speaker_button': {
      mute_icon: 'mute.png',
      unmute_icon: 'unmute.png',
      background_color: '#1243EE',
    },
    'story_page/*/arrow_left_button': {
      arrow_left_icon: 'arrow_left.png',
      background_color: '#1243EE',
    },
    'story_page/*/arrow_right_button': {
      arrow_right_icon: 'arrow_right.png',
      background_color: '#1243EE',
    },
    '*/edit_comment_component/*': {
      theme: {},
    },
    '*/edit_comment_component/edit_cancel_button': {
      cancel_icon: '',
      cancel_button_text: 'Cancel',
      background_color: '',
    },
    '*/edit_comment_component/save_button': {
      save_icon: '',
      save_button_text: 'Save',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/*': {
      theme: {},
    },
    '*/hyper_link_config_component/done_button': {
      done_icon: '',
      done_button_text: 'Done',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/edit_cancel_button': {
      cancel_icon: '',
      cancel_button_text: 'Cancel',
    },
    '*/comment_tray_component/*': {
      theme: {},
    },
    '*/comment_tray_component/comment_bubble_deleted_view': {
      comment_bubble_deleted_icon: 'comment_bubble_deleted.png',
      text: 'This reply has been deleted',
    },
    '*/story_tab_component/*': {},
    '*/story_tab_component/story_ring': {
      progress_color: ['#339AF9', '#78FA58'],
      background_color: '#AB1234',
    },
    '*/story_tab_component/create_new_story_button': {
      create_new_story_icon: 'plus.png',
      background_color: '#1243EE',
    },
    '*/*/close_button': {
      close_icon: 'close.png',
    },
    'social_home_page/top_navigation/header_label': {
      text: 'Community',
    },
    'social_home_page/top_navigation/global_search_button': {
      image: 'searchButtonIcon',
    },
    'social_home_page/top_navigation/post_creation_button': {
      image: 'postCreationIcon',
    },
    'social_home_page/top_navigation/notification_tray_button': {
      image: 'value',
    },
    'social_home_page/*/newsfeed_button': {
      text: 'Newsfeed',
    },
    'social_home_page/*/explore_button': {
      text: 'Explore',
    },
    'social_home_page/*/my_communities_button': {
      text: 'My Communities',
    },
    'social_home_page/empty_newsfeed/illustration': {
      icon: 'emptyFeedIcon',
    },
    'social_home_page/empty_newsfeed/title': {
      text: 'Your Feed is empty',
    },
    'social_home_page/empty_newsfeed/description': {
      text: 'Find community or create your own.',
    },
    'social_home_page/empty_newsfeed/explore_communities_button': {
      icon: 'exploreCommunityIcon',
      text: 'Explore Community',
    },
    'social_home_page/empty_newsfeed/create_community_button': {
      icon: 'createCommunityIcon',
      text: 'Create Community',
    },
    'social_home_page/my_communities/community_avatar': {},
    'social_home_page/my_communities/community_display_name': {},
    'social_home_page/my_communities/community_private_badge': {
      image: 'lockIcon',
    },
    'social_home_page/my_communities/community_official_badge': {
      icon: 'officalBadgeIcon',
    },
    'social_home_page/my_communities/community_category_name': {},
    'social_home_page/my_communities/community_members_count': {},
    'social_home_page/newsfeed_component/*': {},
    'social_home_page/global_feed_component/*': {},
    'social_home_page/post_composer/image_button': {
      icon: 'ImageIcon',
    },
    'social_home_page/post_composer/video_button': {
      icon: 'VideoIcon',
    },
    'social_home_page/post_composer/story_button': {
      icon: 'ImageIcon',
    },
    'social_home_page/create_post_menu/create_clip_button': {
      text: 'Clip',
      image: 'value',
    },
    'social_home_page/*/clipsfeed_button': {
      text: 'Clips',
    },
    'global_search_page/*/*': {},
    'post_detail_page/*/back_button': {
      image: 'backButtonIcon',
    },
    'post_detail_page/*/menu_button': {
      icon: 'menuIcon',
    },
    '*/*/moderator_badge': {
      icon: 'badgeIcon',
      text: 'Moderator',
    },
    '*/post_content/timestamp': {},
    '*/post_content/menu_button': {
      icon: 'menuIcon',
    },
    '*/post_content/post_content_view_count': {},
    '*/post_content/reaction_button': {
      icon: 'likeButtonIcon',
      text: 'Like',
    },
    '*/post_content/comment_button': {
      icon: 'commentButtonIcon',
      text: 'Comment',
    },
    '*/post_content/share_button': {
      icon: 'shareButtonIcon',
      text: 'Share',
    },
    'post_composer_page/*/*': {},
    'post_composer_page/*/close_button': {
      image: 'platformValue',
    },
    'post_composer_page/*/community_display_name': {},
    'post_composer_page/*/create_new_post_button': {
      text: 'Post',
    },
    'post_composer_page/*/edit_post_button': {
      text: 'Save',
    },
    'post_composer_page/*/edit_post_title': {
      text: 'Edit post',
    },
    'post_composer_page/media_attachment/*': {},
    'post_composer_page/media_attachment/camera_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/image_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/video_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/file_button': {
      image: 'platformValue',
    },
    'post_composer_page/media_attachment/detailed_button': {
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/*': {},
    'post_composer_page/detailed_media_attachment/camera_button': {
      text: 'Camera',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/image_button': {
      text: 'Photo',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/video_button': {
      text: 'Video',
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/file_button': {
      text: 'Attachment',
      image: 'platformValue',
    },
    'social_home_page/*/*': {},
    'social_home_page/create_post_menu/*': {},
    'social_home_page/create_post_menu/create_post_button': {
      text: 'Post',
      image: 'Post',
    },
    'social_home_page/create_post_menu/create_story_button': {
      text: 'Story',
      image: 'Story',
    },
    'social_home_page/create_post_menu/create_poll_button': {
      text: 'Poll',
      image: 'Poll',
    },
    'social_home_page/create_post_menu/create_livestream_button': {
      text: 'Livestream',
      image: 'Livestream',
    },
    'select_post_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_post_target_page/*/my_timeline_avatar': {},
    'select_post_target_page/*/title': {
      text: 'Post to',
    },
    'select_post_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
    'select_story_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_story_target_page/*/title': {
      text: 'Share to',
    },
    'select_story_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
    '*/*/community_official_badge': {
      image: 'platformValue',
    },
    '*/*/community_private_badge': {
      image: 'platformValue',
    },
    'social_global_search_page/*/*': {},
    'social_global_search_page/top_search_bar/*': {
      text: 'Search community and user',
    },
    'social_global_search_page/top_search_bar/search_icon': {
      icon: 'search',
    },
    'social_global_search_page/top_search_bar/clear_button': {
      icon: 'clear',
    },
    'social_global_search_page/top_search_bar/cancel_button': {
      text: 'Cancel',
    },
    'social_global_search_page/community_search_result/community_avatar': {},
    'social_global_search_page/community_search_result/community_display_name': {},
    'social_global_search_page/community_search_result/community_private_badge': {
      image: 'lockIcon',
    },
    'social_global_search_page/community_search_result/community_official_badge': {
      icon: 'officialBadgeIcon',
    },
    'social_global_search_page/community_search_result/community_category_name': {},
    'social_global_search_page/community_search_result/community_members_count': {},
    'my_communities_search_page/top_search_bar/*': {
      text: 'Search my community',
    },
    'my_communities_search_page/*/community_avatar': {},
    'my_communities_search_page/*/community_display_name': {},
    'my_communities_search_page/*/community_private_badge': {
      image: 'lockIcon',
    },
    'my_communities_search_page/*/community_official_badge': {
      icon: 'officialBadgeIcon',
    },
    'my_communities_search_page/*/community_category_name': {},
    'my_communities_search_page/*/community_members_count': {},
    'my_communities_search_page/top_search_bar/cancel_button': {
      text: 'Cancel',
    },
    'community_profile_page/*/*': {},
    'community_profile_page/community_feed/*': {},
    '*/post_content/announcement_badge': {
      image: 'value',
    },
    '*/post_content/pin_badge': {
      image: 'value',
    },
    '*/post_content/non_member_section': {
      image: 'value',
    },
    'community_profile_page/community_header/*': {},
    'community_profile_page/community_header/community_cover': {},
    'community_profile_page/community_header/community_name': {},
    'community_profile_page/community_header/community_verify_badge': {
      image: 'value',
    },
    'community_profile_page/community_header/community_category': {},
    'community_profile_page/community_header/community_description': {},
    'community_profile_page/community_header/community_info': {},
    'community_profile_page/community_header/community_join_button': {
      image: 'value',
    },
    'community_profile_page/community_header/community_pending_post': {
      image: 'value',
    },
    'community_profile_page/community_header/back_button': {
      image: 'value',
    },
    'community_profile_page/community_header/menu_button': {
      image: 'value',
    },
    'community_profile_page/community_header/community_cancel_request_button': {
      image: 'value',
    },
    'community_profile_page/invitation_banner/join_button': {
      text: 'Join',
    },
    'community_profile_page/invitation_banner/reject_button': {
      text: 'Decline',
    },
    'community_profile_page/community_profile_tab/*': {},
    'community_profile_page/community_profile_tab/community_feed_tab_button': {
      image: 'value',
    },
    'community_profile_page/community_profile_tab/community_pin_tab_button': {
      image: 'value',
    },
    'community_profile_page/community_pin/*': {},
    'community_profile_page/community_pin/community_create_post_button': {
      image: 'value',
    },
    'community_profile_page/post_content/*': {},
    'community_profile_page/*/create_post_button': {
      text: 'Post',
    },
    'community_profile_page/*/create_story_button': {
      text: 'Story',
    },
    'community_profile_page/*/create_poll_button': {
      text: 'Poll',
    },
    'community_profile_page/*/create_clip_button': {
      text: 'Clip',
    },
    'community_profile_page/community_video_feed/videos_button': {
      text: 'Videos',
    },
    'community_profile_page/community_video_feed/clips_button': {
      text: 'Clips',
    },
    'community_profile_page/community_video_feed/empty_clip_feed': {
      text: 'No clips yet',
      image: 'emptyClipIcon',
    },
    'pending_posts_page/*/*': {},
    'pending_posts_page/*/back_button': {
      image: 'value',
    },
    'pending_posts_page/*/title': {
      text: 'Pending posts ',
    },
    'pending_posts_page/pending_post_content/*': {},
    'pending_posts_page/pending_post_content/timestamp': {},
    'pending_posts_page/pending_post_content/post_accept_button': {
      text: 'Accept',
    },
    'pending_posts_page/pending_post_content/post_decline_button': {
      text: 'Decline',
    },
    'social_home_page/explore_community_categories/*': {},
    'social_home_page/recommended_communities/*': {},
    'social_home_page/*/explore_empty_image': {
      image: 'value',
    },
    'social_home_page/explore_empty/title': {
      text: 'Your explore is empty',
    },
    'social_home_page/explore_empty/description': {
      text: 'Find community or create your own.',
    },
    'social_home_page/explore_empty/explore_create_community': {
      text: 'Create community',
    },
    'social_home_page/explore_community_empty/title': {
      text: 'No community yet',
    },
    'social_home_page/explore_community_empty/description': {
      text: `Let's create your own communities`,
    },
    'social_home_page/explore_community_empty/explore_create_community': {
      text: 'Create community',
    },
    'social_home_page/*/explore_trending_title': {
      text: 'Trending now',
    },
    'social_home_page/*/explore_recommended_title': {
      text: 'Recommended for you',
    },
    'social_home_page/trending_communities/*': {},
    'all_categories_page/*/*': {},
    'communities_by_category_page/*/*': {},
    '*/*/community_join_button': {
      text: 'Join',
    },
    '*/*/community_joined_button': {
      text: 'Joined',
    },
    'communities_by_category_page/*/community_empty_image': {},
    'communities_by_category_page/*/community_empty_title': {
      text: 'No community yet',
    },
    '*/community_sidebar/community_sidebar_title': {
      text: 'Community',
    },
    '*/community_sidebar/newsfeed_sidebar_menu_item': {
      text: 'Newsfeed',
      icon: 'Newspaper',
    },
    '*/community_sidebar/explore_sidebar_menu_item': {
      text: 'Explore',
      icon: 'Global',
    },
    '*/community_sidebar/my_communities_sidebar_title': {
      text: 'My Communities',
    },
    '*/community_sidebar/create_community_sidebar_menu_item': {
      text: 'Create community',
      icon: 'Plus',
    },
    'user_profile_page/*/*': {},
    'user_profile_page/*/back_button': {
      image: 'value',
    },
    'user_profile_page/*/menu_button': {
      image: 'value',
    },
    'user_profile_page/*/user_feed_tab_button': {
      image: 'Feed',
    },
    'user_profile_page/*/user_image_feed_tab_button': {
      image: 'ImageFeed',
    },
    'user_profile_page/*/user_video_feed_tab_button': {
      image: 'VideoFeed',
    },
    'user_profile_page/user_profile_header/*': {},
    'user_profile_page/user_feed/*': {},
    'user_profile_page/user_image_feed/*': {},
    'user_profile_page/user_video_feed/*': {},
    'user_profile_page/post_composer/image_button': {
      icon: 'ImageIcon',
    },
    'user_profile_page/post_composer/video_button': {
      icon: 'VideoIcon',
    },
    'user_profile_page/post_composer/story_button': {
      icon: 'ImageIcon',
    },
    'user_relationship_page/*/*': {},
    'user_pending_follow_request_page/*/*': {},
    'user_profile_page/user_profile_header/follow_user_button': {
      text: 'Follow',
      image: 'Plus',
    },
    'user_profile_page/user_profile_header/following_user_button': {
      text: 'Following',
      image: 'FollowingUser',
    },
    'user_profile_page/user_profile_header/pending_user_button': {
      text: 'Cancel request',
      image: 'PendingUser',
    },
    'user_profile_page/user_profile_header/unblock_user_button': {
      text: 'Unblock',
      image: 'UnblockUser',
    },
    'user_profile_page/user_profile_header/user_avatar': {},
    'user_profile_page/user_profile_header/user_name': {},
    'user_profile_page/user_profile_header/user_description': {},
    'user_profile_page/user_profile_header/user_following': {
      text: 'following',
    },
    'user_profile_page/user_profile_header/user_follower': {
      text: 'followers',
    },
    'user_profile_page/user_feed/empty_user_feed': {
      text: 'No posts yet',
      image: 'EmptyPost',
    },
    'user_profile_page/user_feed/private_user_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_feed/private_user_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_feed/blocked_user_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_feed/blocked_user_feed_info': {
      text: 'Unblock to see their posts.',
    },
    'user_profile_page/user_image_feed/empty_user_image_feed': {
      text: 'No photos yet',
      image: 'EmptyImagePost',
    },
    'user_profile_page/user_image_feed/private_user_image_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_image_feed/private_user_image_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_image_feed/blocked_user_image_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_image_feed/blocked_user_image_feed_info': {
      text: 'Unblock to see their posts.',
    },
    'user_profile_page/user_video_feed/empty_user_video_feed': {
      text: 'No videos yet',
      image: 'EmptyVideoPost',
    },
    'user_profile_page/user_video_feed/private_user_video_feed': {
      text: 'This account is private',
      image: 'PrivateFeed',
    },
    'user_profile_page/user_video_feed/private_user_video_feed_info': {
      text: 'Follow this user to see their posts.',
    },
    'user_profile_page/user_video_feed/blocked_user_video_feed': {
      text: 'You’ve blocked this user',
      image: 'BlockedUser',
    },
    'user_profile_page/user_video_feed/blocked_user_video_feed_info': {
      text: 'Unblock to see their posts.',
    },

    'user_profile_page/user_video_feed/videos_button': {
      text: 'Videos',
    },
    'user_profile_page/user_video_feed/clips_button': {
      text: 'Clips',
    },
    'user_profile_page/user_video_feed/empty_clip_feed': {
      text: 'No clips yet',
      image: 'emptyClipIcon',
    },

    'edit_user_profile_page/*/*': {},
    'edit_user_profile_page/*/back_button': {
      image: 'ArrowLeft',
    },
    'edit_user_profile_page/*/title': {
      text: 'Edit profile',
    },
    'edit_user_profile_page/*/user_display_name_title': {
      text: 'Display name',
    },
    'edit_user_profile_page/*/user_about_title': {
      text: 'About',
    },
    'edit_user_profile_page/*/update_user_profile_button': {
      text: 'Save',
    },
    'blocked_users_page/*/*': {},
    'blocked_users_page/*/back_button': {
      image: 'ArrowLeft',
    },
    'blocked_users_page/*/title': {
      text: 'Manage blocked users',
    },
    'blocked_users_page/*/user_list_unblock_user_button': {
      text: 'Unblock',
    },
    'community_setup_page/*/*': {},
    'community_setup_page/*/close_button': {
      image: 'value',
    },
    'community_setup_page/*/title': {
      text: 'Create community',
    },
    'community_setup_page/*/community_edit_title': {
      text: 'Edit community',
    },
    'community_setup_page/*/community_name_title': {
      text: 'Community name',
    },
    'community_setup_page/*/community_about_title': {
      text: 'About',
    },
    'community_setup_page/*/community_category_title': {
      text: 'Categories',
    },
    'community_setup_page/*/community_privacy_title': {
      text: 'Privacy',
    },
    'community_setup_page/*/community_privacy_private_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_title': {
      text: 'Private',
    },
    'community_setup_page/*/community_privacy_private_description': {
      text: 'Only members invited by the moderators can join, view, and search the posts in this community.',
    },
    'community_setup_page/*/community_privacy_public_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_public_title': {
      text: 'Public',
    },
    'community_setup_page/*/community_privacy_public_description': {
      text: 'Community is discoverable by anyone. Content is visible to anyone.',
    },
    'community_setup_page/*/community_add_member_title': {
      text: 'Member',
    },
    'community_setup_page/*/community_add_member_button': {
      text: 'Add',
      image: 'value',
    },
    'community_setup_page/*/community_invite_member_title': {
      text: 'Invite members',
    },
    'community_setup_page/*/community_invite_member_button': {
      text: 'Invite',
      image: 'value',
    },
    'community_setup_page/*/community_invite_member_description': {
      text: 'They will join as members after accepting your invitation.',
      image: 'value',
    },
    'community_setup_page/*/community_create_button': {
      text: 'Create community',
      image: 'value',
    },
    'community_setup_page/*/community_edit_button': {
      text: 'Save',
      image: 'value',
    },
    'community_setup_page/*/image_button': {
      text: 'Photo',
      image: 'value',
    },
    'community_setup_page/*/camera_button': {
      text: 'Camera',
      image: 'value',
    },
    'community_setup_page/*/community_membership_title': {
      text: 'Membership',
    },
    'community_setup_page/*/community_membership_description': {
      text: 'Requires moderator approval',
    },
    'community_setup_page/*/community_membership_sub_description': {
      text: 'Users will become members only when their join request is approved by a moderator of this community.',
    },
    'community_setup_page/*/community_privacy_private_and_visible_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_and_visible_title': {
      text: 'Private & visible',
    },
    'community_setup_page/*/community_privacy_private_and_visible_description': {
      text: 'Community is discoverable by anyone. Content is hidden from non-members.',
    },
    'community_setup_page/*/community_privacy_private_and_hidden_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_and_hidden_title': {
      text: 'Private & hidden',
    },
    'community_setup_page/*/community_privacy_private_and_hidden_description': {
      text: 'Community and content are hidden from non-members, and cannot be discovered via search.',
    },
    'community_add_category_page/*/*': {},
    'community_add_member_page/*/*': {},
    'community_membership_page/*/*': {},
    'community_setting_page/*/*': {},

    'community_setting_page/*/edit_profile': {
      text: 'Community profile',
    },
    'community_setting_page/*/members': {
      text: 'Members',
    },
    'community_setting_page/*/pending_invitations': {
      text: 'Pending invitations',
    },
    'community_setting_page/*/notifications': {
      text: 'Notifications',
    },
    'community_setting_page/*/post_permission': {
      text: 'Post permission',
    },
    'community_setting_page/*/story_setting': {
      text: 'Story comment',
    },
    'community_setting_page/*/leave_community': {
      text: 'Leave community',
    },
    'community_setting_page/*/close_community': {
      text: 'Close community',
    },
    'community_setting_page/*/close_community_description': {
      text: 'Closing this community will remove the community  page and all its content and comments.',
    },
    'community_post_permission_page/*/*': {},
    'community_story_setting_page/*/*': {},
    'community_notification_page/*/*': {},
    'community_posts_notification_page/*/*': {},
    'community_comments_notification_page/*/*': {},
    'community_stories_notification_page/*/*': {},
    'poll_post_composer_page/*/*': {},
    'poll_post_composer_page/*/poll_question_title': {
      text: 'Poll question',
    },
    'poll_post_composer_page/*/poll_options_title': {
      text: 'Options',
    },
    'poll_post_composer_page/*/poll_options_desc': {
      text: 'Poll must contain at least 2 options.',
    },
    'poll_post_composer_page/*/poll_add_option_button': {
      text: 'Add option',
      image: 'plusIcon',
    },
    'poll_post_composer_page/*/poll_duration_title': {
      text: 'Poll duration',
    },
    'poll_post_composer_page/*/poll_duration_desc': {
      text: 'You can always close the poll before the set duration.',
    },
    'poll_post_composer_page/*/poll_multiple_selection_title': {
      text: 'Multiple selection',
    },
    'poll_post_composer_page/*/poll_multiple_selection_desc': {
      text: 'Let participants vote more than one option',
    },
    'poll_post_composer_page/*/create_new_post_button': {
      text: 'Post',
    },
    'select_poll_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_poll_target_page/*/my_timeline_avatar': {},
    'select_poll_target_page/*/title': {
      text: 'Post to',
    },
    'select_poll_target_page/*/my_timeline_text': {
      text: 'My Timeline',
    },
    'livestream_terminated_page/*/*': {},
    'livestream_terminated_page/*/livestream_terminated_action_button': {},
    'notification_tray_page/*/*': {},
    'notification_tray_page/*/back_button': {
      image: 'value',
    },
    'notification_tray_page/*/title': {
      text: 'Notifications',
    },
    'notification_tray_page/*/empty_notification': {
      image: 'value',
      text: 'No notifications',
    },
    'notification_tray_page/*/no_internet_connection': {
      image: 'value',
      text: 'No internet connection',
    },
    'notification_tray_page/*/user_avatar': {
      image: 'value',
    },
    '*/*/notification_section_text': {
      text: 'value',
    },
    'notification_tray_page/invitation_section/*': {},
    'notification_tray_page/invitation_section/invitation_section_title': {
      text: 'Requests',
    },
    'notification_tray_page/invitation_section/user_avatar': {},
    'notification_tray_page/invitation_section/invitation_description': {},
    'notification_tray_page/invitation_section/invitation_date': {},
    'notification_tray_page/invitation_section/accept_invite_button': {
      text: 'Join',
    },
    'notification_tray_page/invitation_section/decline_invite_button': {
      text: 'Decline',
    },
    'community_invite_member_page/top_search_bar/*': {
      text: 'Search user',
    },
    'community_invite_member_page/top_search_bar/search_icon': {
      image: 'value',
    },
    'community_invite_member_page/top_search_bar/clear_button': {
      image: 'value',
    },
    'community_invite_member_page/*/close_button': {
      image: 'value',
    },
    'community_invite_member_page/*/invite_button': {
      text: 'Invite',
    },
    'community_invite_member_page/*/title': {
      text: 'Invite member',
    },
    'community_invite_member_page/*/no_result_title': {
      text: 'No results found',
    },
    'community_invite_member_page/*/no_result_icon': {
      image: 'value',
    },
    'community_invite_member_page/*/empty_result_title': {
      text: 'No users available',
    },
    'community_invite_member_page/*/empty_result_icon': {
      image: 'value',
    },
    'community_invite_member_page/*/no_internet_title': {
      text: 'No internet connection',
    },
    'community_invite_member_page/*/no_internet_icon': {
      image: 'value',
    },
    'community_pending_invitation_page/*/back_button': {
      image: 'value',
    },
    'community_pending_invitation_page/*/title': {
      text: 'Pending invitations',
    },
    'community_pending_invitation_page/*/empty_result_title': {
      text: 'Nothing here to see yet',
    },
    'community_pending_invitation_page/*/empty_result_icon': {
      image: 'value',
    },
    'community_pending_invitation_page/*/no_internet_title': {
      text: 'No internet connection',
    },
    'community_pending_invitation_page/*/no_internet_icon': {
      image: 'value',
    },
    'pending_request_page/*/*': {},
    'pending_request_page/*/back_button': {
      image: 'backIcon',
    },
    'pending_request_page/*/title': {
      text: 'Pending requests',
    },
    'pending_request_page/pending_post_list/*': {},
    'pending_request_page/pending_post_list/timestamp': {},
    'pending_request_page/pending_post_list/post_accept_button': {
      text: 'Accept',
    },
    'pending_request_page/pending_post_list/post_decline_button': {
      text: 'Decline',
    },
    'pending_request_page/*/posts_button_tab': {
      text: 'Posts',
    },
    'pending_request_page/pending_post_list/posts_tab_description': {
      text: 'Decline pending post will permanently delete the selected post from community.',
    },
    'pending_request_page/*/join_requests_button_tab': {
      text: 'Join requests',
    },
    'pending_request_page/join_request_content/join_requests_tab_description': {
      text: 'Declining a join request is irreversible. The user must send a new request if declined.',
    },
    'pending_request_page/join_request_content/join_accept_button': {
      text: 'Accept',
    },
    'pending_request_page/join_request_content/join_decline_button': {
      text: 'Decline',
    },

    'draft_clip_page/*/back_button': {
      image: 'value',
    },
    'draft_clip_page/*/mute_button': {
      image: 'value',
    },
    'draft_clip_page/*/aspect_ratio_button': {
      image: 'value',
    },
    'draft_clip_page/*/next_button': {
      image: 'value',
    },
    'clip_feed_page/*/*': {
      theme: {},
    },
    'clip_feed_page/*/back_button': {
      image: 'value',
    },
    'clip_feed_page/*/title': {
      text: 'value',
    },
    'clip_feed_page/*/create_new_clip_button': {
      image: 'value',
    },
    'clip_feed_page/*/reaction_button': {
      image: 'value',
    },
    'clip_feed_page/*/comment_button': {
      image: 'value',
    },
    'clip_feed_page/*/mute_button': {
      image: 'value',
    },
    'clip_feed_page/*/option_button': {
      image: 'value',
    },
    'clip_feed_page/*/community_display_name': {},
    'clip_feed_page/*/community_private_badge': {
      image: 'lockIcon',
    },
    'clip_feed_page/*/community_official_badge': {
      image: 'officialBadgeIcon',
    },
    'clip_feed_page/*/explore_communities_button': {
      icon: 'exploreCommunityIcon',
      text: 'Explore Community',
    },
    'clip_feed_page/*/create_community_button': {
      icon: 'createCommunityIcon',
      text: 'Create Community',
    },
  },
};

export const getCustomizationKeys = ({
  page,
  component,
  element,
}: {
  page: string;
  component: string;
  element: string;
}) => {
  if (element !== '*') {
    return [
      `${page}/${component}/${element}`,
      `*/${component}/${element}`,
      `${page}/*/${element}`,
      `*/*/${element}`,
      `${page}/${component}/*`,
      `*/${component}/*`,
      `${page}/*/*`,
    ];
  } else if (component !== '*') {
    return [`${page}/${component}/*`, `${page}/*/*`, `*/${component}/*`];
  } else if (page !== '*') {
    return [`${page}/*/*`];
  }

  return [];
};

const propertyMappings: Record<keyof ThemeValue, string> = {
  primary_color: '--asc-color-primary-default',
  primary_shade1_color: '--asc-color-primary-shade1',
  primary_shade2_color: '--asc-color-primary-shade2',
  primary_shade3_color: '--asc-color-primary-shade3',
  primary_shade4_color: '--asc-color-primary-shade4',
  secondary_color: '--asc-color-secondary-default',
  secondary_shade1_color: '--asc-color-secondary-shade1',
  secondary_shade2_color: '--asc-color-secondary-shade2',
  secondary_shade3_color: '--asc-color-secondary-shade3',
  secondary_shade4_color: '--asc-color-secondary-shade4',
  base_color: '--asc-color-base-default',
  base_shade1_color: '--asc-color-base-shade1',
  base_shade2_color: '--asc-color-base-shade2',
  base_shade3_color: '--asc-color-base-shade3',
  base_shade4_color: '--asc-color-base-shade4',
  base_shade5_color: '--asc-color-base-shade5',
  alert_color: '--asc-color-alert-default',
  background_color: '--asc-color-background-default',
  base_inverse_color: '--asc-color-base-inverse',
  header_background_color: '--asc-color-header-background-color',
  background_shade1_color: '--asc-color-background-shade1',
  black_color: '--asc-color-black',
  white_color: '--asc-color-white',
  live_color: '--asc-color-live',
  highlight_color: '--asc-color-highlight-default',
  message_bubble_primary_color: '--asc-color-message-bubble-primary',
  message_bubble_secondary_color: '--asc-color-message-bubble-secondary',
  background_transparent_black_color: '--asc-color-background-transparent-black',
  background_transparent_white_color: '--asc-color-background-transparent-white',
  primary_background_hover_color: '--asc-color-primary-background-hover',
  primary_background_pressed_color: '--asc-color-primary-background-pressed',
  primary_background_disabled_color: '--asc-color-primary-background-disabled',
  plyr_color_main: '--plyr-color-main',
  plyr_video_control_background_hover: '--plyr-video-control-background-hover',
  transparent_black: '--asc-color-transparent-black',
};

export const themePropertiesToCSSVar = ({ theme }: { theme: Partial<ThemeValue> }) => {
  if (!theme) return;

  const primary = generateShades(theme.primary_color);
  const mergedTheme = {
    ...theme,
    primary_shade1_color: primary[0],
    primary_shade2_color: primary[1],
    primary_shade3_color: primary[2],
    primary_shade4_color: primary[3],
  };

  Object.entries(mergedTheme).forEach(([key, value]) => {
    const cssVar = propertyMappings[key as keyof ThemeValue];
    if (cssVar && value) {
      document.documentElement.style.setProperty(cssVar, value);
    }
  });
};
