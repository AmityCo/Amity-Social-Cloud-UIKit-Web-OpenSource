import React, { createContext, useContext, useState, useEffect } from 'react';
import { AmityReactionType } from './CustomReactionProvider';

interface CustomizationContextValue {
  config: Config | null;
  parseConfig: (config: Config) => void;
  isExcluded: (path: string) => boolean;
  getConfig: (path: string) => Record<string, any>;
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

export interface Config {
  preferred_theme?: 'light' | 'dark' | 'default';
  theme?: {
    light?: Theme['light'];
    dark?: Theme['dark'];
  };
  excludes?: string[];
  message_reactions?: AmityReactionType[];
  customizations?: {
    'select_target_page/*/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
      title?: string;
    };
    'select_target_page/*/back_button'?: {
      back_icon?: string;
    };
    'camera_page/*/*'?: {
      resolution?: string;
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'camera_page/*/close_button'?: {
      close_icon?: string;
      background_color?: string;
    };
    'create_story_page/*/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'create_story_page/*/back_button'?: {
      back_icon?: string;
      background_color?: string;
    };
    'create_story_page/*/aspect_ratio_button'?: {
      aspect_ratio_icon?: string;
      background_color?: string;
    };
    'create_story_page/*/story_hyperlink_button'?: {
      hyperlink_button_icon?: string;
      background_color?: string;
    };
    'create_story_page/*/hyper_link'?: {
      hyper_link_icon?: string;
      background_color?: string;
    };
    'create_story_page/*/share_story_button'?: {
      share_icon?: string;
      background_color?: string;
      hide_avatar?: boolean;
    };
    'story_page/*/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'story_page/*/progress_bar'?: {
      progress_color?: string;
      background_color?: string;
    };
    'story_page/*/overflow_menu'?: {
      overflow_menu_icon?: string;
    };
    'story_page/*/close_button'?: {
      close_icon?: string;
    };
    'story_page/*/story_impression_button'?: {
      impression_icon?: string;
    };
    'story_page/*/story_comment_button'?: {
      comment_icon?: string;
      background_color?: string;
    };
    'story_page/*/story_reaction_button'?: {
      reaction_icon?: string;
      background_color?: string;
    };
    'story_page/*/create_new_story_button'?: {
      create_new_story_icon?: string;
      background_color?: string;
    };
    'story_page/*/speaker_button'?: {
      mute_icon?: string;
      unmute_icon?: string;
      background_color?: string;
    };
    '*/edit_comment_component/*'?: {
      theme?: {
        light_theme?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    '*/edit_comment_component/cancel_button'?: {
      cancel_icon?: string;
      cancel_button_text?: string;
      background_color?: string;
    };
    '*/edit_comment_component/save_button'?: {
      save_icon?: string;
      save_button_text?: string;
      background_color?: string;
    };
    '*/hyper_link_config_component/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    '*/hyper_link_config_component/done_button'?: {
      done_icon?: string;
      done_button_text?: string;
      background_color?: string;
    };
    '*/hyper_link_config_component/cancel_button'?: {
      cancel_icon?: string;
      cancel_button_text?: string;
    };
    '*/comment_tray_component/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    '*/story_tab_component/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    '*/story_tab_component/story_ring'?: {
      progress_color?: string[];
      background_color?: string;
    };
    '*/story_tab_component/create_new_story_button'?: {
      create_new_story_icon?: string;
      background_color?: string;
    };
    '*/*/close_button'?: {
      close_icon?: string;
    };
    'live_chat/*/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
        dark?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'live_chat/chat_header/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
        dark?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'live_chat/message_list/*'?: {
      theme?: {
        light?: {
          primary_color?: string;
          secondary_color?: string;
        };
        dark?: {
          primary_color?: string;
          secondary_color?: string;
        };
      };
    };
    'live_chat/message_composer/*'?: {
      placeholder_text?: 'Write a message';
    };
  };
}

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
  initialConfig: Config;
}

export const defaultConfig: Config = {
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
    '*/edit_comment_component/*': {
      theme: {},
    },
    '*/edit_comment_component/cancel_button': {
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
    '*/hyper_link_config_component/cancel_button': {
      cancel_icon: '',
      cancel_button_text: 'Cancel',
    },
    '*/comment_tray_component/*': {
      theme: {},
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
  },
};

export const CustomizationProvider: React.FC<CustomizationProviderProps> = ({
  children,
  initialConfig,
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
    // Check if mandatory fields are present
    if (
      !config?.preferred_theme ||
      !config?.theme ||
      !config?.excludes ||
      !config?.customizations
    ) {
      return false;
    }

    return true;
  };

  const parseConfig = (newConfig: Config) => {
    setConfig(newConfig);
  };

  const isExcluded = (path: string) => {
    if (!config) return false;
    return !!config.excludes?.some((exclude) => {
      const regex = new RegExp(`^${exclude.replace(/\*/g, '.*')}$`);
      return regex.test(path);
    });
  };

  const getConfig = (path: string) => {
    if (!config?.customizations) return {};
    return config?.customizations[path as keyof Config['customizations']] || {};
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
