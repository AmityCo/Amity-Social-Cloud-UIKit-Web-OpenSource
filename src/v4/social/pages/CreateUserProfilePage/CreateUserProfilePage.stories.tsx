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

/**
 * Secure-mode example: the userId is minted at Save time via `generateUserId`,
 * then `getAuthToken(userId)` is called to mint a short-lived auth token for
 * that id. In a real app `getAuthToken` would call your backend (Server Key);
 * here it just returns a mock string. `getAuthToken` takes precedence over the
 * static `authToken` prop, and is re-invoked on session renewal.
 */
export const CreateUserProfilePageSecureMode = {
  render: (args: { userId?: string }) => {
    const props: CreateUserProfilePageProps = {
      // No static userId: generate it at Save, then key the token to it.
      generateUserId: async ({ displayName } = {}) => {
        const minted = `${(displayName || 'user').toLowerCase().replace(/\s+/g, '-')}-${args.userId}`;
        console.log('[CreateUserProfilePage] generateUserId ->', minted);
        return minted;
      },
      getAuthToken: async (resolvedUserId) => {
        // Real apps: POST to your backend to mint a token for resolvedUserId.
        console.log('[CreateUserProfilePage] getAuthToken for', resolvedUserId);
        return `mock-auth-token-for-${resolvedUserId}`;
      },
      onCreated: (user) => {
        console.log('[CreateUserProfilePage] onCreated', user);
      },
      onError: (error) => {
        console.log('[CreateUserProfilePage] onError', error);
      },
      onCancel: () => {
        console.log('[CreateUserProfilePage] onCancel');
      },
    };
    return <CreateUserProfilePage {...props} />;
  },
  args: {
    userType: 'visitor',
    userId: 'secure-demo',
  },
};
