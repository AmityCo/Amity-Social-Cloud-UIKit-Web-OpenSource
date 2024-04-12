import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { CustomizationProvider } from '~/v4/core/providers/CustomizationProvider';
import { CommentTray } from './CommentTray';
import buildGlobalTheme from '~/core/providers/UiKitProvider/theme';
import { theme } from '../../theme';

export default {
  title: 'Components/CommentTray',
  component: CommentTray,
  decorators: [
    (Story) => (
      <ThemeProvider theme={buildGlobalTheme(theme)}>
        <CustomizationProvider
          initialConfig={{
            preferred_theme: 'light',
            theme: {
              light: {
                primary_color: '#FF0000',
                secondary_color: '#00FF00',
                base_color: '#0000FF',
                base_shade1_color: '#000000',
                base_shade2_color: '#000000',
                base_shade3_color: '#000000',
                base_shade4_color: '#000000',
                alert_color: '#000000',
                background_color: '#FFFFFF',
              },
              dark: {
                primary_color: '#FF0000',
                secondary_color: '#00FF00',
                base_color: '#0000FF',
                base_shade1_color: '#000000',
                base_shade2_color: '#000000',
                base_shade3_color: '#000000',
                base_shade4_color: '#000000',
                alert_color: '#000000',
                background_color: '#000000',
              },
            },
            excludes: [],
            customizations: {
              '*/comment_tray_component/*': {
                component_theme: {
                  light_theme: {
                    primary_color: '#FF0000',
                    secondary_color: '#00FF00',
                  },
                },
              },
            },
          }}
        >
          <div
            style={{
              width: '50%',
            }}
          >
            <Story />
          </div>
        </CustomizationProvider>
      </ThemeProvider>
    ),
  ],
} as ComponentMeta<typeof CommentTray>;

const Template: ComponentStory<typeof CommentTray> = (args) => <CommentTray {...args} />;

export const Default = Template.bind({});
Default.args = {
  pageId: '*',
  storyId: 'story123',
  commentId: 'comment123',
  referenceType: 'story',
  referenceId: 'story123',
  replyTo: 'user123',
  isReplying: false,
  limit: 5,
  isOpen: true,
  isJoined: true,
  allowCommentInStory: true,
  onClose: () => {},
  onClickReply: () => {},
  onCancelReply: () => {},
};

export const Replying = Template.bind({});
Replying.args = {
  ...Default.args,
  isReplying: true,
};

export const NotJoined = Template.bind({});
NotJoined.args = {
  ...Default.args,
  isJoined: false,
};
