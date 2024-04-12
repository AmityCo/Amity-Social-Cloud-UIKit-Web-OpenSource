import React, { createContext, useEffect, useState } from 'react';
import { lighten, parseToHsl, darken, hslToColorString } from 'polished';

const SHADE_PERCENTAGES = [0.25, 0.4, 0.5, 0.75];

const setCSSVariable = (variable: string, value?: string) => {
  if (!value) return;
  document.documentElement.style.setProperty(variable, value);
};

const generateShades = (hexColor: string, isDarkMode = false): string[] => {
  const hslColor = parseToHsl(hexColor);

  const shades = SHADE_PERCENTAGES.map((percentage) => {
    if (isDarkMode) {
      return darken(percentage, hslToColorString(hslColor));
    } else {
      return lighten(percentage, hslToColorString(hslColor));
    }
  });

  return shades;
};

export const ThemeContext = createContext<{
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}>({
  currentTheme: 'light',
  toggleTheme: () => {},
});

const defaultConfig = {
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

export const ThemeProvider: React.FC<{ initialConfig?: any }> = ({ children, initialConfig }) => {
  const config = initialConfig || defaultConfig;

  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const primaryColorShades = generateShades(config.light.primary_color);
    const secondaryColorShades = generateShades(config.light.secondary_color);

    setCSSVariable('--asc-color-primary-default', config.light.primary_color);
    setCSSVariable('--asc-color-primary-shade1', primaryColorShades[0]);
    setCSSVariable('--asc-color-primary-shade2', primaryColorShades[1]);
    setCSSVariable('--asc-color-primary-shade3', primaryColorShades[2]);
    setCSSVariable('--asc-color-primary-shade4', primaryColorShades[3]);

    setCSSVariable('--asc-color-secondary-default', config.light.secondary_color);
    setCSSVariable('--asc-color-secondary-shade1', secondaryColorShades[0]);
    setCSSVariable('--asc-color-secondary-shade2', secondaryColorShades[1]);
    setCSSVariable('--asc-color-secondary-shade3', secondaryColorShades[2]);
    setCSSVariable('--asc-color-secondary-shade4', secondaryColorShades[3]);

    setCSSVariable('--asc-color-base-default', config.light?.base_color);
    setCSSVariable('--asc-color-base-shade1', config.light?.base_shade1_color);
    setCSSVariable('--asc-color-base-shade2', config.light?.base_shade2_color);
    setCSSVariable('--asc-color-base-shade3', config.light?.base_shade3_color);
    setCSSVariable('--asc-color-base-shade4', config.light?.base_shade4_color);

    setCSSVariable('--asc-color-alert', config.light?.alert_color);
    setCSSVariable('--asc-color-background', config.light?.background_color);

    setCSSVariable('--asc-color-primary-dark', config.dark?.primary_color);
  }, [currentTheme, config]);

  useEffect(() => {
    if (config.preferred_theme === 'default') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [config.preferred_theme]);

  const toggleTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
