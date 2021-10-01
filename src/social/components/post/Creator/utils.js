import { PostRepository, PostTargetType } from '@amityco/js-sdk';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { notification } from '~/core/components/Notification';
import promisify from '~/helpers/promisify';

export const MAX_IMAGES = 10;
export const MAX_FILES = 10;

export const getAuthorId = ({ communityId, userId } = {}) => communityId || userId;

export const isIdenticalAuthor = (a, b) => !!getAuthorId(a) && getAuthorId(a) === getAuthorId(b);

export const maxImagesWarning = () =>
  notification.info({
    content: 'You reached the maximum attachment of 10',
  });

export const maxFilesWarning = () =>
  notification.info({
    content: 'The selected file is larger than 1GB. Please select a new file. ',
  });

export async function createPost({ targetId, targetType, data, dataType, attachments }) {
  return promisify(
    PostRepository.createPost({ targetId, targetType, data, dataType, attachments }),
  );
}

/**
 * Some users (moderators, etc) can publish posts without premoderation even
 * if premoderation is turned off. Here we check if the post is moved to reviewing feed.
 * If so, show the message to user
 */
export async function showPostCreatedNotification(post, community) {
  if (
    post.targetType === PostTargetType.CommunityFeed &&
    community.needApprovalOnPostCreation &&
    post.feedId === community.reviewingFeed.feedId
  ) {
    notification.success({ content: <FormattedMessage id="post.success.submittedToReview" /> });
  }
}
