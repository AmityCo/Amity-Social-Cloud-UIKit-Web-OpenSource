import React from 'react';
import { CreateUserProfilePage, CreateUserProfilePageProps } from './CreateUserProfilePage';

export default {
  title: 'v4-social/pages/CreateUserProfilePage',
};

/**
 * Renders the create-profile flow inside the V4 decorator.
 *
 * To exercise the real "visitor -> signed-in" transition:
 *   1. In the Storybook Controls panel set `userType` to `visitor`
 *      (the page must be reachable before a signed-in login exists).
 *   2. Set `userId` to the id you want to create/sign in as.
 *   3. Fill in the form and press Save — the page calls Client.login with that
 *      userId (creating the profile), then fires onCreated.
 *
 * onCreated / onCancel here just log to the Actions panel.
 */
export const CreateUserProfilePageStories = {
  render: (args: { userId?: string }) => {
    const props: CreateUserProfilePageProps = {
      userId: args.userId || 'Web-Test-Create-Profile',
      onCreated: (userId) => {
        console.log('[CreateUserProfilePage] onCreated', userId);
      },
      onCancel: () => {
        console.log('[CreateUserProfilePage] onCancel');
      },
    };
    return <CreateUserProfilePage {...props} />;
  },
  args: {
    userType: 'visitor',
    userId: 'Web-Test-Create-Profile',
  },
};
