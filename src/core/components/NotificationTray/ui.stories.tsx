import React from 'react';

import { NotificationRecordList as UINotificationRecordList } from './NotificationRecordList';
import { NotificationRecordPopover as UINotificationRecordPopover } from './NotificationRecordPopover';

import {
  mockNotificationRecordComment,
  mockNotificationRecordLike,
  mockNotificationRecordPost,
} from './mocks';

export default {
  title: 'Ui Only',
};

export const NotificationRecordList = ({ notificationRecords, ...props }) => {
  return <UINotificationRecordList notificationRecords={notificationRecords} {...props} />;
};

export const NotificationRecordPopover = ({ notificationRecords, isLoading, error, ...props }) => {
  return (
    <UINotificationRecordPopover listProps={{ notificationRecords, isLoading, error }} {...props} />
  );
};

const argTypes = {
  isLoading: { control: { type: 'boolean' } },
  hasMore: { control: { type: 'boolean' } },
  error: { control: { type: 'text' } },
  loadMore: { action: 'loadMore()' },
  onClick: { action: 'onClick' },
};

const args = {
  notificationRecords: [
    mockNotificationRecordComment,
    mockNotificationRecordLike,
    mockNotificationRecordPost,
  ],

  isLoading: false,
  hasMore: false,
};

NotificationRecordList.argTypes = argTypes;
NotificationRecordList.args = args;

NotificationRecordPopover.argTypes = {
  ...argTypes,
  maxH: { control: { type: 'number' } },
  showUnreadBadge: { control: { type: 'boolean' } },
  onMarkAllClick: { action: 'onMarkAllClick()' },
  onViewAllClick: { action: 'onViewAllClick()' },
};
NotificationRecordPopover.args = { ...args, maxH: 320, showUnreadBadge: true };
