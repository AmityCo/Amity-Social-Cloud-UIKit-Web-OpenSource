/**
 * The resolver's one load-bearing assumption is the shape of the SDK's exports:
 * a repository is a plain object of functions, and some group a family under a
 * nested namespace. If the walk misses them every lookup returns undefined,
 * every module reads as on, and the guard becomes a no-op that no other test
 * notices.
 *
 * The fixture below mirrors the real shape, checked against @amityco/ts-sdk
 * 6.x: PostRepository is 35 flat functions, CommunityRepository adds
 * `Moderation` and `Membership`, UserRepository adds `Relationship`. The real
 * module is not imported here because it holds an open handle and never lets
 * the worker exit.
 */
const relationship = {
  follow: () => () => {},
  unfollow: () => () => {},
  blockUser: () => () => {},
  getFollowInfo: () => () => {},
  onUserFollowed: () => () => {},
};

const membership = { getMembers: () => () => {} };

jest.mock('@amityco/ts-sdk', () => ({
  PostRepository: { getPost: () => () => {}, getPosts: () => () => {} },
  CommentRepository: { getComments: () => () => {} },
  CommunityRepository: {
    getCommunity: () => () => {},
    Membership: membership,
    AmityCommunityMemberStatusFilter: { all: 'all' },
  },
  UserRepository: {
    getUser: () => () => {},
    getUsers: () => () => {},
    getBlockedUsers: () => () => {},
    searchUserByDisplayName: () => () => {},
    Relationship: relationship,
  },
  FileRepository: {
    fileUrlWithSize: () => '',
    uploadClip: () => () => {},
    uploadImage: () => () => {},
  },
}));

import * as SDK from '@amityco/ts-sdk';

import { moduleOfSdkFn } from '~/v4/core/providers/CustomizationProvider/moduleApi';

const sdk = SDK as unknown as Record<string, Record<string, never>>;

describe('moduleOfSdkFn', () => {
  it('binds a repository method to the module that owns the repository', () => {
    expect(moduleOfSdkFn(sdk.PostRepository.getPost)).toBe('post');
    expect(moduleOfSdkFn(sdk.CommentRepository.getComments)).toBe('comment');
    expect(moduleOfSdkFn(sdk.CommunityRepository.getCommunity)).toBe('community');
  });

  it('reaches one namespace deep', () => {
    // CommunityRepository.Membership.getMembers is still community's to gate.
    expect(moduleOfSdkFn(membership.getMembers)).toBe('community');
  });

  it('leaves the base layer unowned, so it is never gated', () => {
    // Reading a user or building a file url is not a flaggable capability, and
    // gating it would empty every avatar in the app.
    expect(moduleOfSdkFn(sdk.UserRepository.getUser)).toBeUndefined();
    expect(moduleOfSdkFn(sdk.UserRepository.getUsers)).toBeUndefined();
    expect(moduleOfSdkFn(sdk.FileRepository.fileUrlWithSize)).toBeUndefined();
    expect(moduleOfSdkFn(sdk.FileRepository.uploadImage)).toBeUndefined();
  });

  it('gates a named leaf on a base-layer repository', () => {
    expect(moduleOfSdkFn(relationship.follow)).toBe('userRelationship');
    expect(moduleOfSdkFn(relationship.blockUser)).toBe('userRelationship');
    expect(moduleOfSdkFn(sdk.UserRepository.getBlockedUsers)).toBe('userRelationship');
    // A clip upload is a post surface: core never sold clip as a module, and
    // in the app the clip pages and buttons are Post's.
    expect(moduleOfSdkFn(sdk.FileRepository.uploadClip)).toBe('post');
  });

  it('does not claim a sibling of a named leaf', () => {
    // `Relationship` is not listed as a repository, so only the methods the
    // table names are gated — a realtime subscriber is not one of them.
    expect(moduleOfSdkFn(relationship.onUserFollowed)).toBeUndefined();
    expect(moduleOfSdkFn(sdk.UserRepository.searchUserByDisplayName)).toBeUndefined();
  });

  it('resolves by identity, not by name', () => {
    expect(moduleOfSdkFn(sdk.PostRepository.getPost)).not.toBe(
      moduleOfSdkFn(sdk.CommentRepository.getComments),
    );
  });

  it('answers nothing for anything that is not a function', () => {
    expect(moduleOfSdkFn(undefined)).toBeUndefined();
    expect(moduleOfSdkFn(null)).toBeUndefined();
    expect(moduleOfSdkFn('PostRepository.getPost')).toBeUndefined();
    expect(moduleOfSdkFn(sdk.CommunityRepository.AmityCommunityMemberStatusFilter)).toBeUndefined();
  });
});
