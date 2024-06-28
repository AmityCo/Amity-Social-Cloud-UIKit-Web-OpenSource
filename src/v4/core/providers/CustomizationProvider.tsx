import React, { createContext, useContext, useState, useEffect } from 'react';
import { AmityReactionType } from './CustomReactionProvider';

export type GetConfigReturnValue = IconConfiguration &
  TextConfiguration &
  ThemeConfiguration &
  CustomConfiguration;

interface CustomizationContextValue {
  config: Config | null;
  parseConfig: (config: Config) => void;
  isExcluded: (path: string) => boolean;
  getConfig: (
    path: string,
  ) => IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
}

export type Theme = {
  light: {
    primary_color: string;
    secondary_color: string;
    base_color: string;
    base_shade1_color: string;
    base_shade2_color: string;
    base_shade3_color: string;
    base_shade4_color: string;
    alert_color: string;
    background_color: string;
    base_inverse_color: string;
  };
  dark: {
    primary_color: string;
    secondary_color: string;
    base_color: string;
    base_shade1_color: string;
    base_shade2_color: string;
    base_shade3_color: string;
    base_shade4_color: string;
    alert_color: string;
    background_color: string;
    base_inverse_color: string;
  };
};

type ThemeConfiguration = {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Partial<Pick<Theme['light'], 'primary_color' | 'secondary_color'>>;
    dark?: Partial<Pick<Theme['dark'], 'primary_color' | 'secondary_color'>>;
  };
};

export interface Config {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Theme['light'];
    dark?: Theme['dark'];
  };
  excludes?: string[];
  message_reactions?: AmityReactionType[];
  customizations?: {
    [key: string]: IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
  };
}

type DefaultConfig = {
  preferred_theme: 'light' | 'dark' | 'default';
  theme: {
    light: Theme['light'];
    dark: Theme['dark'];
  };
  excludes: string[];
  customizations?: {
    [key: string]: IconConfiguration & TextConfiguration & ThemeConfiguration & CustomConfiguration;
  };
};

const CustomizationContext = createContext<CustomizationContextValue>({
  config: null,
  parseConfig: () => {},
  isExcluded: () => false,
  getConfig: () => ({}),
});

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};

interface CustomizationProviderProps {
  children: React.ReactNode;
  initialConfig: Config | undefined;
}

type IconConfiguration = {
  icon?: string;
  image?: string;
};
type TextConfiguration = {
  text?: string;
};
type CustomConfiguration = {
  [key: string]: string | undefined | boolean | Array<string> | number | Record<string, unknown>;
};

export const defaultConfig: DefaultConfig = {
  preferred_theme: 'default',
  theme: {
    light: {
      primary_color: '#1054DE',
      secondary_color: '#292B32',
      base_color: '#292b32',
      base_shade1_color: '#636878',
      base_shade2_color: '#898e9e',
      base_shade3_color: '#a5a9b5',
      base_shade4_color: '#ebecef',
      alert_color: '#FA4D30',
      background_color: '#FFFFFF',
      base_inverse_color: '#000000',
    },
    dark: {
      primary_color: '#1054DE',
      secondary_color: '#292B32',
      base_color: '#ebecef',
      base_shade1_color: '#a5a9b5',
      base_shade2_color: '#6e7487',
      base_shade3_color: '#40434e',
      base_shade4_color: '#292b32',
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
      back_icon: 'back.png',
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
      cancel_button_text: 'cancel',
      background_color: '#1243EE',
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
      icon: 'searchButtonIcon',
    },
    'social_home_page/top_navigation/post_creation_button': {
      icon: 'postCreationIcon',
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
      text: 'Find community or create your own',
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
      icon: 'lockIcon',
    },
    'social_home_page/my_communities/community_official_badge': {
      icon: 'officalBadgeIcon',
    },
    'social_home_page/my_communities/community_category_name': {},
    'social_home_page/my_communities/community_members_count': {},
    'social_home_page/newsfeed_component/*': {},
    'social_home_page/global_feed_component/*': {},
    'global_search_page/*/*': {},
    'post_detail_page/*/back_button': {
      icon: 'backButtonIcon',
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
      icon: 'lockIcon',
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
      icon: 'lockIcon',
    },
    'my_communities_search_page/*/community_official_badge': {
      icon: 'officialBadgeIcon',
    },
    'my_communities_search_page/*/community_category_name': {},
    'my_communities_search_page/*/community_members_count': {},
    'my_communities_search_page/top_search_bar/cancel_button': {
      text: 'Cancel',
    },
  },
};

export const getDefaultConfig: CustomizationContextValue['getConfig'] = (path: string) => {
  const [page, component, element] = path.split('/');

  const customizationKeys = (() => {
    if (element !== '*') {
      return [
        `${page}/${component}/${element}`,
        `${page}/*/${element}`,
        `${page}/${component}/*`,
        `${page}/*/*`,
        `*/${component}/${element}`,
        `*/*/${element}`,
        `*/${component}/*`,
        `*/*/*`,
      ];
    } else if (component !== '*') {
      return [`${page}/${component}/*`, `${page}/*/*`, `*/${component}/*`, `*/*/*`];
    } else if (page !== '*') {
      return [`${page}/*/*`, `*/*/*`];
    }

    return [];
  })();

  return new Proxy<
    IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
  >(
    {},
    {
      get(target, prop: string) {
        for (const key of customizationKeys) {
          if (defaultConfig?.customizations?.[key]?.[prop]) {
            return defaultConfig.customizations[key][prop];
          }
        }
      },
    },
  );
};

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
  initialConfig = {},
}) => {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (validateConfig(initialConfig)) {
      parseConfig(initialConfig);
    } else {
      console.error('Invalid configuration provided to CustomizationProvider');
    }
  }, [initialConfig]);

  const validateConfig = (config: Config): boolean => {
    return true;
  };

  const parseConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };

  const isExcluded = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = (() => {
      if (element !== '*') {
        return [
          `${page}/${component}/${element}`,
          `${page}/*/${element}`,
          `${page}/${component}/*`,
          `${page}/*/*`,
          `*/${component}/${element}`,
          `*/*/${element}`,
          `*/${component}/*`,
          `*/*/*`,
        ];
      } else if (component !== '*') {
        return [`${page}/${component}/*`, `${page}/*/*`, `*/${component}/*`, `*/*/*`];
      } else if (page !== '*') {
        return [`${page}/*/*`, `*/*/*`];
      }

      return [];
    })();

    return (
      config?.excludes?.some((excludedPath) => {
        return customizationKeys.some((key) => key === excludedPath);
      }) || false
    );
  };

  const getConfig: CustomizationContextValue['getConfig'] = (path: string) => {
    const [page, component, element] = path.split('/');

    const customizationKeys = (() => {
      if (element !== '*') {
        return [
          `${page}/${component}/${element}`,
          `${page}/*/${element}`,
          `${page}/${component}/*`,
          `${page}/*/*`,
          `*/${component}/${element}`,
          `*/*/${element}`,
          `*/${component}/*`,
          `*/*/*`,
        ];
      } else if (component !== '*') {
        return [`${page}/${component}/*`, `${page}/*/*`, `*/${component}/*`, `*/*/*`];
      } else if (page !== '*') {
        return [`${page}/*/*`, `*/*/*`];
      }

      return [];
    })();

    return new Proxy<
      IconConfiguration & TextConfiguration & { theme?: Partial<Theme> } & CustomConfiguration
    >(
      {},
      {
        get(target, prop: string) {
          for (const key of customizationKeys) {
            if (config?.customizations?.[key]?.[prop]) {
              return config.customizations[key][prop];
            }
          }

          if (prop === 'theme' && !!config?.theme) {
            return config.theme;
          }

          for (const key of customizationKeys) {
            if (defaultConfig?.customizations?.[key]?.[prop]) {
              return defaultConfig.customizations[key][prop];
            }
          }

          if (prop === 'theme') {
            return defaultConfig.theme;
          }
          if (prop === 'preferred_theme') {
            return defaultConfig.preferred_theme;
          }
        },
      },
    );
  };

  const contextValue: CustomizationContextValue = {
    config,
    parseConfig,
    isExcluded,
    getConfig,
  };

  return (
    <CustomizationContext.Provider value={contextValue}>{children}</CustomizationContext.Provider>
  );
};
