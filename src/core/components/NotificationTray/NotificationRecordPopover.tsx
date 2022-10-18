import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  ButtonProps,
  PopoverProps,
  Button,
  useDisclosure,
  Icon,
} from '@noom/wax-component-library';

import { Badge } from './NotificationRecordItem';
import {
  NotificationRecordList,
  NotificationRecordListProps,
  NotificationRecordListHeader,
} from './NotificationRecordList';

export type NotificationRecordPopoverProps = {
  popoverProps?: PopoverProps;
  triggerButtonProps?: ButtonProps;
  listProps: NotificationRecordListProps;
  maxH?: number;
  showUnreadBadge?: boolean;
  unreadBadgeLabel?: number | string;
  onMarkAllClick?: () => void;
  onViewAllClick?: () => void;
};

export function NotificationRecordPopover({
  maxH,
  showUnreadBadge,
  popoverProps,
  onMarkAllClick,
  onViewAllClick,
  triggerButtonProps,
  listProps,
  unreadBadgeLabel = '!',
}: NotificationRecordPopoverProps) {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleMarkAllClick = () => {
    onClose();
    onMarkAllClick?.();
  };

  const handleViewAllClick = () => {
    onClose();
    onViewAllClick?.();
  };

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} {...popoverProps}>
      <PopoverTrigger>
        <Button onClick={onOpen} position="relative" p={2} {...triggerButtonProps}>
          <Icon icon="bell" size="xl" />
          {showUnreadBadge && (
            <Badge size="sm" position="absolute" top={2} right={2}>
              {unreadBadgeLabel}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent _focus={{ boxShadow: 'md' }} _active={{ boxShadow: 'md' }}>
        <PopoverArrow />
        <PopoverHeader>
          <NotificationRecordListHeader
            isDisabled={listProps.isLoading || !!listProps.error}
            onMarkAllClick={handleMarkAllClick}
          />
        </PopoverHeader>
        <PopoverBody maxH={maxH} display="flex" flexDir="column">
          <NotificationRecordList {...listProps} flex={1} />

          {onViewAllClick ? (
            <Box pt={1} borderTopWidth={1}>
              <Button
                height="2em"
                variant="link"
                w="100%"
                size="sm"
                colorScheme="primary"
                fontWeight="normal"
                onClick={handleViewAllClick}
              >
                <FormattedMessage id="notificationTray.viewAll" />
              </Button>
            </Box>
          ) : null}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
