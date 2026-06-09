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
  custom_toast_background: string;
  live_stream_chat_bubble_color: string;
  base_divider_line: string;
  elevation_08_01_color: string;
  elevation_08_02_color: string;
  elevation_08_03_color: string;
  host_color: string;
  host_color_shade1: string;
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
  white_color: '#ffffff',
  live_color: '#ff305a',
  highlight_color: '#1054de',
  background_transparent_black_color: '#00000080',
  background_transparent_white_color: '#fffc',
  message_bubble_primary_color: '#1054de',
  primary_background_hover_color: '#0d47ba',
  primary_background_pressed_color: '#0b3997',
  primary_background_disabled_color: '#d9e5fc',
  plyr_color_main: '#f6f7f8',
  plyr_video_control_background_hover: 'rgb(0 0 0 / 30%)',
  transparent_black: 'rgb(0 0 0 / 50%)',
  trasparent_black_color: 'rgb(0 0 0 / 50%)',
  live_stream_chat_bubble_color: 'rgba(99, 104, 120, 0.30)',
  base_divider_line: ' #292B32',
  host_color: '#4B1BD0',
  host_color_shade1: '#EAE2FF',
};

export const defaultBaseThemeValue: { dark: BaseThemeValue; light: BaseThemeValue } = {
  dark: {
    background_shade1_color: '#40434e',
    message_bubble_secondary_color: '#292b32',
    custom_toast_background: '#40434e',
    elevation_08_01_color: 'rgba(0, 0, 0, 0.10)',
    elevation_08_02_color: 'rgba(0, 0, 0, 0.08)',
    elevation_08_03_color: 'rgba(0, 0, 0, 0.04)',

    ...defaultBase,
  },
  light: {
    background_shade1_color: '#f6f7f8',
    message_bubble_secondary_color: '#ebecef',
    custom_toast_background: '#292B32',
    elevation_08_01_color: 'rgba(41, 43, 50, 0.10)',
    elevation_08_02_color: 'rgba(41, 43, 50, 0.08)',
    elevation_08_03_color: 'rgba(41, 43, 50, 0.04)',
    ...defaultBase,
  },
};

export const defaultConfig: DefaultConfig = {
  preferred_theme: 'default',
  theme: {
    light: {
      primary_color: '#1054de',
      secondary_color: '#292b32',
      secondary_shade1_color: '#636878',
      secondary_shade2_color: '#898e9e',
      secondary_shade3_color: '#a5a9b5',
      secondary_shade4_color: '#ebecef',
      base_color: '#292b32',
      base_shade1_color: '#636878',
      base_shade2_color: '#898e9e',
      base_shade3_color: '#a5a9b5',
      base_shade4_color: '#ebecef',
      base_shade5_color: '#F9F9FA',
      alert_color: '#FA4D30',
      background_color: '#FFFFFF',
      base_inverse_color: '#000000',
    },
    dark: {
      primary_color: '#1054de',
      secondary_color: '#ebecef',
      secondary_shade1_color: '#a5a9b5',
      secondary_shade2_color: '#898e9e',
      secondary_shade3_color: '#40434e',
      secondary_shade4_color: '#292b32',
      base_color: '#ebecef',
      base_shade1_color: '#a5a9b5',
      base_shade2_color: '#6e7487',
      base_shade3_color: '#40434e',
      base_shade4_color: '#292b32',
      base_shade5_color: '#f9f9fa',
      alert_color: '#FA4D30',
      background_color: '#191919',
      base_inverse_color: '#FFFFFF',
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
      background_color: '#ffffff',
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
      cancel_button_text: '',
      background_color: '',
    },
    '*/edit_comment_component/save_button': {
      save_icon: '',
      save_button_text: '',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/*': {
      theme: {},
    },
    '*/hyper_link_config_component/done_button': {
      done_icon: '',
      done_button_text: '',
      background_color: '#1243EE',
    },
    '*/hyper_link_config_component/edit_cancel_button': {
      cancel_icon: '',
      cancel_button_text: '',
    },
    '*/comment_tray_component/*': {
      theme: {},
    },
    '*/comment_tray_component/comment_bubble_deleted_view': {
      comment_bubble_deleted_icon: 'comment_bubble_deleted.png',
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
    'social_home_page/top_navigation/header_label': {},
    'social_home_page/top_navigation/global_search_button': {
      image: 'searchButtonIcon',
    },
    'social_home_page/top_navigation/post_creation_button': {
      image: 'postCreationIcon',
    },
    'social_home_page/top_navigation/notification_tray_button': {
      image: 'value',
    },
    'social_home_page/*/for_you_button': {},
    'social_home_page/*/newsfeed_button': {},
    'social_home_page/*/explore_button': {},
    'social_home_page/*/my_communities_button': {},
    'social_home_page/*/communities_button': {},
    'social_home_page/*/events_button': {},

    'social_home_page/empty_newsfeed/illustration': {
      icon: 'emptyFeedIcon',
    },
    'social_home_page/empty_newsfeed/title': {},
    'social_home_page/empty_newsfeed/description': {},
    'social_home_page/empty_newsfeed/explore_communities_button': {
      icon: 'exploreCommunityIcon',
    },
    'social_home_page/empty_newsfeed/create_community_button': {
      icon: 'createCommunityIcon',
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
    'social_home_page/for_you_feed_component/*': {},
    'social_home_page/feed_caught_up_component/*': {},
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
      image: 'value',
    },

    'social_home_page/*/clipsfeed_button': {},
    'global_search_page/*/*': {},
    'post_detail_page/*/back_button': {
      image: 'backButtonIcon',
    },
    'post_detail_page/*/menu_button': {
      icon: 'menuIcon',
    },
    '*/*/moderator_badge': {
      icon: 'badgeIcon',
    },
    '*/post_content/timestamp': {},
    '*/post_content/menu_button': {
      icon: 'menuIcon',
    },
    '*/post_content/post_content_view_count': {},
    '*/post_content/reaction_button': {
      icon: 'likeButtonIcon',
    },
    '*/post_content/comment_button': {
      icon: 'commentButtonIcon',
    },
    '*/post_content/share_button': {
      icon: 'shareButtonIcon',
    },
    'post_composer_page/*/*': {},
    'post_composer_page/*/close_button': {
      image: 'platformValue',
    },
    'post_composer_page/*/community_display_name': {},
    'post_composer_page/*/create_new_post_button': {},
    'post_composer_page/*/edit_post_button': {},
    'post_composer_page/*/edit_post_title': {},
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
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/image_button': {
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/video_button': {
      image: 'platformValue',
    },
    'post_composer_page/detailed_media_attachment/file_button': {
      image: 'platformValue',
    },
    'social_home_page/*/*': {},
    'social_home_page/create_post_menu/*': {},
    'social_home_page/create_post_menu/create_post_button': {
      image: 'Post',
    },
    'social_home_page/create_post_menu/create_story_button': {
      image: 'Story',
    },
    'social_home_page/create_post_menu/create_poll_button': {
      image: 'Poll',
    },
    'social_home_page/create_post_menu/create_livestream_button': {
      image: 'Livestream',
    },
    'social_home_page/create_post_menu/create_event_button': {
      image: '',
    },
    'select_post_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_post_target_page/*/my_timeline_avatar': {},
    'select_post_target_page/*/title': {},
    'select_post_target_page/*/my_timeline_text': {},
    'select_story_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_story_target_page/*/title': {},
    'select_story_target_page/*/my_timeline_text': {},
    '*/*/community_official_badge': {
      image: 'platformValue',
    },
    '*/*/community_private_badge': {
      image: 'platformValue',
    },
    'social_global_search_page/*/*': {},
    'social_global_search_page/top_search_bar/*': {},
    'social_global_search_page/top_search_bar/search_icon': {
      icon: 'search',
    },
    'social_global_search_page/top_search_bar/clear_button': {
      icon: 'clear',
    },
    'social_global_search_page/top_search_bar/cancel_button': {},
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
    'my_communities_search_page/top_search_bar/*': {},
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
    'my_communities_search_page/top_search_bar/cancel_button': {},
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
    'community_profile_page/invitation_banner/join_button': {},
    'community_profile_page/invitation_banner/reject_button': {},
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
    'community_profile_page/*/create_post_button': {},
    'community_profile_page/*/create_story_button': {},
    'community_profile_page/*/create_poll_button': {},
    'community_profile_page/*/create_clip_button': {},
    'community_profile_page/*/create_event_button': {},
    'community_profile_page/community_video_feed/videos_button': {},
    'community_profile_page/community_video_feed/clips_button': {},
    'community_profile_page/community_video_feed/empty_clip_feed': {
      image: 'emptyClipIcon',
    },
    'pending_posts_page/*/*': {},
    'pending_posts_page/*/back_button': {
      image: 'value',
    },
    'pending_posts_page/*/title': {},
    'pending_posts_page/pending_post_content/*': {},
    'pending_posts_page/pending_post_content/timestamp': {},
    'pending_posts_page/pending_post_content/post_accept_button': {},
    'pending_posts_page/pending_post_content/post_decline_button': {},
    'social_home_page/explore_community_categories/*': {},
    'social_home_page/recommended_communities/*': {},
    'social_home_page/*/explore_empty_image': {
      image: 'value',
    },
    'social_home_page/explore_empty/title': {},
    'social_home_page/explore_empty/description': {},
    'social_home_page/explore_empty/explore_create_community': {},
    'social_home_page/explore_community_empty/title': {},
    'social_home_page/explore_community_empty/description': {},
    'social_home_page/explore_community_empty/explore_create_community': {},
    'social_home_page/*/explore_trending_title': {},
    'social_home_page/*/explore_recommended_title': {},
    'social_home_page/trending_communities/*': {},
    'all_categories_page/*/*': {},
    'communities_by_category_page/*/*': {},
    '*/*/community_join_button': {},
    '*/*/community_joined_button': {},
    'communities_by_category_page/*/community_empty_image': {},
    'communities_by_category_page/*/community_empty_title': {},
    '*/community_sidebar/community_sidebar_title': {},
    '*/community_sidebar/for_you_sidebar_menu_item': {
      icon: 'Home',
    },
    '*/community_sidebar/newsfeed_sidebar_menu_item': {
      icon: 'UserCheck',
    },
    '*/community_sidebar/explore_sidebar_menu_item': {
      icon: 'Global',
    },
    '*/community_sidebar/my_communities_sidebar_title': {},
    '*/community_sidebar/create_community_sidebar_menu_item': {
      icon: 'Plus',
    },
    '*/community_sidebar/communities_sidebar_menu_item': {
      icon: '',
    },
    '*/community_sidebar/events_sidebar_menu_item': {
      icon: '',
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
      image: 'Plus',
    },
    'user_profile_page/user_profile_header/following_user_button': {
      image: 'FollowingUser',
    },
    'user_profile_page/user_profile_header/pending_user_button': {
      image: 'PendingUser',
    },
    'user_profile_page/user_profile_header/unblock_user_button': {
      image: 'UnblockUser',
    },
    'user_profile_page/user_profile_header/user_avatar': {},
    'user_profile_page/user_profile_header/user_name': {},
    'user_profile_page/user_profile_header/user_description': {},
    'user_profile_page/user_profile_header/user_following': {},
    'user_profile_page/user_profile_header/user_follower': {},
    'user_profile_page/user_feed/empty_user_feed': {
      image: 'EmptyPost',
    },
    'user_profile_page/user_feed/private_user_feed': {
      image: 'PrivateFeed',
    },
    'user_profile_page/user_feed/private_user_feed_info': {},
    'user_profile_page/user_feed/blocked_user_feed': {
      image: 'BlockedUser',
    },
    'user_profile_page/user_feed/blocked_user_feed_info': {},
    'user_profile_page/user_image_feed/empty_user_image_feed': {
      image: 'EmptyImagePost',
    },
    'user_profile_page/user_image_feed/private_user_image_feed': {
      image: 'PrivateFeed',
    },
    'user_profile_page/user_image_feed/private_user_image_feed_info': {},
    'user_profile_page/user_image_feed/blocked_user_image_feed': {
      image: 'BlockedUser',
    },
    'user_profile_page/user_image_feed/blocked_user_image_feed_info': {},
    'user_profile_page/user_video_feed/empty_user_video_feed': {
      image: 'EmptyVideoPost',
    },
    'user_profile_page/user_video_feed/private_user_video_feed': {
      image: 'PrivateFeed',
    },
    'user_profile_page/user_video_feed/private_user_video_feed_info': {},
    'user_profile_page/user_video_feed/blocked_user_video_feed': {
      image: 'BlockedUser',
    },
    'user_profile_page/user_video_feed/blocked_user_video_feed_info': {},

    'user_profile_page/user_clip_feed/private_user_clip_feed': {
      image: 'PrivateFeed',
    },
    'user_profile_page/user_clip_feed/private_user_clip_feed_info': {},
    'user_profile_page/user_clip_feed/blocked_user_clip_feed': {
      image: 'BlockedUser',
    },
    'user_profile_page/user_clip_feed/blocked_user_clip_feed_info': {},

    'user_profile_page/user_video_feed/videos_button': {},
    'user_profile_page/user_video_feed/clips_button': {},
    'user_profile_page/user_video_feed/empty_clip_feed': {
      image: 'emptyClipIcon',
    },

    'edit_user_profile_page/*/*': {},
    'edit_user_profile_page/*/back_button': {
      image: 'ArrowLeft',
    },
    'edit_user_profile_page/*/title': {},
    'edit_user_profile_page/*/user_display_name_title': {},
    'edit_user_profile_page/*/user_about_title': {},
    'edit_user_profile_page/*/update_user_profile_button': {},
    'blocked_users_page/*/*': {},
    'blocked_users_page/*/back_button': {
      image: 'ArrowLeft',
    },
    'blocked_users_page/*/title': {},
    'blocked_users_page/*/user_list_unblock_user_button': {},
    'community_setup_page/*/*': {},
    'community_setup_page/*/close_button': {
      image: 'value',
    },
    'community_setup_page/*/title': {},
    'community_setup_page/*/community_edit_title': {},
    'community_setup_page/*/community_name_title': {},
    'community_setup_page/*/community_about_title': {},
    'community_setup_page/*/community_category_title': {},
    'community_setup_page/*/community_privacy_title': {},
    'community_setup_page/*/community_privacy_private_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_title': {},
    'community_setup_page/*/community_privacy_private_description': {},
    'community_setup_page/*/community_privacy_public_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_public_title': {},
    'community_setup_page/*/community_privacy_public_description': {},
    'community_setup_page/*/community_add_member_title': {},
    'community_setup_page/*/community_add_member_button': {
      image: 'value',
    },
    'community_setup_page/*/community_invite_member_title': {},
    'community_setup_page/*/community_invite_member_button': {
      image: 'value',
    },
    'community_setup_page/*/community_invite_member_description': {
      image: 'value',
    },
    'community_setup_page/*/community_create_button': {
      image: 'value',
    },
    'community_setup_page/*/community_edit_button': {
      image: 'value',
    },
    'community_setup_page/*/image_button': {
      image: 'value',
    },
    'community_setup_page/*/camera_button': {
      image: 'value',
    },
    'community_setup_page/*/community_membership_title': {},
    'community_setup_page/*/community_membership_description': {},
    'community_setup_page/*/community_membership_sub_description': {},
    'community_setup_page/*/community_privacy_private_and_visible_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_and_visible_title': {},
    'community_setup_page/*/community_privacy_private_and_visible_description': {},
    'community_setup_page/*/community_privacy_private_and_hidden_icon': {
      image: 'value',
    },
    'community_setup_page/*/community_privacy_private_and_hidden_title': {},
    'community_setup_page/*/community_privacy_private_and_hidden_description': {},
    'community_add_category_page/*/*': {},
    'community_add_member_page/*/*': {},
    'community_membership_page/*/*': {},
    'community_setting_page/*/*': {},

    'community_setting_page/*/edit_profile': {},
    'community_setting_page/*/members': {},
    'community_setting_page/*/pending_invitations': {},
    'community_setting_page/*/notifications': {},
    'community_setting_page/*/post_permission': {},
    'community_setting_page/*/story_setting': {},
    'community_setting_page/*/leave_community': {},
    'community_setting_page/*/close_community': {},
    'community_setting_page/*/close_community_description': {},
    'community_post_permission_page/*/*': {},
    'community_story_setting_page/*/*': {},
    'community_notification_page/*/*': {},
    'community_posts_notification_page/*/*': {},
    'community_comments_notification_page/*/*': {},
    'community_stories_notification_page/*/*': {},
    'poll_post_composer_page/*/*': {},
    'poll_post_composer_page/*/post_title': {},
    'poll_post_composer_page/*/poll_question_title': {},
    'poll_post_composer_page/*/poll_options_title': {},
    'poll_post_composer_page/*/poll_options_desc': {},
    'poll_post_composer_page/*/poll_add_option_button': {
      image: 'plusIcon',
    },
    'poll_post_composer_page/*/poll_duration_title': {},
    'poll_post_composer_page/*/poll_duration_desc': {},
    'poll_post_composer_page/*/poll_multiple_selection_title': {},
    'poll_post_composer_page/*/poll_multiple_selection_desc': {},
    'poll_post_composer_page/*/create_new_post_button': {},
    'select_poll_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_poll_target_page/*/my_timeline_avatar': {},
    'select_poll_target_page/*/title': {},
    'select_poll_target_page/*/my_timeline_text': {},
    'select_livestream_target_page/*/close_button': {
      image: 'platformValue',
    },
    'select_livestream_target_page/*/my_timeline_avatar': {},
    'select_livestream_target_page/*/title': {},
    'select_livestream_target_page/*/my_timeline_text': {},
    'livestream_terminated_page/*/*': {},
    'livestream_terminated_page/*/livestream_terminated_action_button': {},
    'livestream_banned_page/*/*': {},
    'livestream_banned_page/*/title': {},
    'livestream_banned_page/*/livestream_banned_image': {
      image: 'BannedCaution',
    },
    'livestream_banned_page/*/livestream_banned_title': {},
    'livestream_banned_page/*/livestream_banned_description': {},
    'livestream_banned_page/*/livestream_banned_button': {},
    'notification_tray_page/*/*': {},
    'notification_tray_page/*/back_button': {
      image: 'value',
    },
    'notification_tray_page/*/title': {},
    'notification_tray_page/*/empty_notification': {
      image: 'value',
    },
    'notification_tray_page/*/no_internet_connection': {
      image: 'value',
    },
    'notification_tray_page/*/user_avatar': {
      image: 'value',
    },
    '*/*/notification_section_text': {},
    'notification_tray_page/invitation_section/*': {},
    'notification_tray_page/invitation_section/invitation_section_title': {},
    'notification_tray_page/invitation_section/user_avatar': {},
    'notification_tray_page/invitation_section/invitation_description': {},
    'notification_tray_page/invitation_section/invitation_date': {},
    'notification_tray_page/invitation_section/accept_invite_button': {},
    'notification_tray_page/invitation_section/decline_invite_button': {},
    'community_invite_member_page/top_search_bar/*': {},
    'community_invite_member_page/top_search_bar/search_icon': {
      image: 'value',
    },
    'community_invite_member_page/top_search_bar/clear_button': {
      image: 'value',
    },
    'community_invite_member_page/*/close_button': {
      image: 'value',
    },
    'community_invite_member_page/*/invite_button': {},
    'community_invite_member_page/*/title': {},
    'community_invite_member_page/*/no_result_title': {},
    'community_invite_member_page/*/no_result_icon': {
      image: 'value',
    },
    'community_invite_member_page/*/empty_result_title': {},
    'community_invite_member_page/*/empty_result_icon': {
      image: 'value',
    },
    'community_invite_member_page/*/no_internet_title': {},
    'community_invite_member_page/*/no_internet_icon': {
      image: 'value',
    },
    'community_pending_invitation_page/*/back_button': {
      image: 'value',
    },
    'community_pending_invitation_page/*/title': {},
    'community_pending_invitation_page/*/empty_result_title': {},
    'community_pending_invitation_page/*/empty_result_icon': {
      image: 'value',
    },
    'community_pending_invitation_page/*/no_internet_title': {},
    'community_pending_invitation_page/*/no_internet_icon': {
      image: 'value',
    },
    'pending_request_page/*/*': {},
    'pending_request_page/*/back_button': {
      image: 'backIcon',
    },
    'pending_request_page/*/title': {},
    'pending_request_page/pending_post_list/*': {},
    'pending_request_page/pending_post_list/timestamp': {},
    'pending_request_page/pending_post_list/post_accept_button': {},
    'pending_request_page/pending_post_list/post_decline_button': {},
    'pending_request_page/*/posts_button_tab': {},
    'pending_request_page/pending_post_list/posts_tab_description': {},
    'pending_request_page/*/join_requests_button_tab': {},
    'pending_request_page/join_request_content/join_requests_tab_description': {},
    'pending_request_page/join_request_content/join_accept_button': {},
    'pending_request_page/join_request_content/join_decline_button': {},
    '*/livestream_chat_compose_bar/message_composer': {},
    '*/livestream_chat_compose_bar/reaction_button': {
      name: 'like',
      image: '',
    },
    '*/livestream_chat_compose_bar/create_message_button': {
      image: '',
    },
    '*/livestream_chat_compose_bar/swap_camera_button': {
      image: '',
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
    'clip_feed_page/*/title': {},
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
    },
    'clip_feed_page/*/create_community_button': {
      icon: 'createCommunityIcon',
    },
    'livestream_player_page/*/share_link': {
      image: 'icon',
    },
    'livestream_player_page/*/copy_link': {
      image: 'icon',
    },
    'create_livestream_page/*/share_link': {
      image: 'icon',
    },
    'create_livestream_page/*/copy_link': {
      image: 'icon',
    },
    'clip_feed_page/*/share_link': {
      image: 'icon',
    },
    'clip_feed_page/*/copy_link': {
      image: 'icon',
    },
    'post_detail_page/*/share_link': {
      image: 'icon',
    },
    'post_detail_page/*/copy_link': {
      image: 'icon',
    },
    '*/post_content/share_link': {
      image: 'icon',
    },
    '*/post_content/copy_link': {
      image: 'icon',
    },
    'user_profile_page/*/share_link': {
      image: 'icon',
    },
    'user_profile_page/*/copy_link': {
      image: 'icon',
    },
    'community_profile_page/*/share_link': {
      image: 'icon',
    },
    'community_profile_page/*/copy_link': {
      image: 'icon',
    },

    'select_event_target_page/*/*': {},
    'select_event_target_page/*/close_button': {
      image: '',
    },
    'select_event_target_page/*/title': {},

    'event_setup_page/*/*': {},
    'event_setup_page/*/camera_button': {
      image: '',
    },
    'event_setup_page/*/image_button': {
      image: '',
    },
    'event_setup_page/*/event_name_title': {},
    'event_setup_page/*/event_details_title': {},
    'event_setup_page/*/event_date_time_title': {},
    'event_setup_page/*/event_location_title': {},
    '*/*/brand_badge': {
      image: 'value',
    },
    '*/product_tag_list/*': {},
    '*/product_tag_list/product_tag': {},
    '*/product_tag_selection/*': {
      background_color: '',
    },
    '*/product_tag_selection/product_tag_selection_header': {
      create_mode_title: '',
      edit_mode_title: '',
      done_button_text: '',
    },
    '*/product_tag_selection/product_tag_selection_search_bar': {
      placeholder: '',
    },
    '*/product_tag_selection/product_tag_selection_item': {},
    '*/product_tag_selection/product_tag_empty': {},
    '*/product_tag_selection/product_tag_no_result': {},
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
  background_shade1_color: '--asc-color-background-shade1',
  black_color: '--asc-color-black',
  white_color: '--asc-color-white',
  live_color: '--asc-color-live',
  highlight_color: '--asc-color-highlight-default',
  message_bubble_primary_color: '--asc-color-message-bubble-primary',
  message_bubble_secondary_color: '--asc-color-message-bubble-secondary',
  live_stream_chat_bubble_color: '--asc-color-live-steram-chat-bubble',
  base_divider_line: '--asc-color-base-divider-line',
  background_transparent_black_color: '--asc-color-background-transparent-black',
  background_transparent_white_color: '--asc-color-background-transparent-white',
  primary_background_hover_color: '--asc-color-primary-background-hover',
  primary_background_pressed_color: '--asc-color-primary-background-pressed',
  primary_background_disabled_color: '--asc-color-primary-background-disabled',
  custom_toast_background: '--asc-color-custom-toast-background',
  plyr_color_main: '--plyr-color-main',
  plyr_video_control_background_hover: '--plyr-video-control-background-hover',
  transparent_black: '--asc-color-transparent-black',
  elevation_08_01_color: '--asc-color-elevation-08-01',
  elevation_08_02_color: '--asc-color-elevation-08-02',
  elevation_08_03_color: '--asc-color-elevation-08-03',
  host_color: '--asc-color-host-default',
  host_color_shade1: '--asc-color-host-shade1',
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
