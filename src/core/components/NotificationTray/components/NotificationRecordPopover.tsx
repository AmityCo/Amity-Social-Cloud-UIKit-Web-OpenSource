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
  Icon,
  useBreakpointValue,
} from '@noom/wax-component-library';

import { Badge } from './NotificationRecordItem';
import {
  NotificationRecordList,
  NotificationRecordListProps,
  NotificationRecordListHeader,
} from './NotificationRecordList';

export type NotificationRecordPopoverProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  popoverProps?: PopoverProps;
  triggerButtonProps?: ButtonProps;
  listProps: NotificationRecordListProps;
  maxH?: number;
  showUnreadBadge?: boolean;
  showViewAllButton?: boolean;
  showMarkAllButton?: boolean;
  unreadBadgeLabel?: number | string;
  onMarkAllClick?: () => void;
  onViewAllClick?: () => void;
};

export function NotificationRecordPopover({
  maxH,
  isOpen,
  onOpen,
  onClose,
  showUnreadBadge,
  showMarkAllButton,
  showViewAllButton,
  popoverProps,
  onMarkAllClick,
  onViewAllClick,
  triggerButtonProps,
  listProps,
  unreadBadgeLabel = '!',
}: NotificationRecordPopoverProps) {
  const handleMarkAllClick = () => {
    onClose();
    onMarkAllClick?.();
  };

  const handleViewAllClick = () => {
    onClose();
    onViewAllClick?.();
  };

  const width = useBreakpointValue({ base: '100vw', md: '450px' });

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
      <PopoverContent _focus={{ boxShadow: 'md' }} _active={{ boxShadow: 'md' }} w={width}>
        <PopoverArrow />
        <PopoverHeader>
          <NotificationRecordListHeader
            isDisabled={listProps.isLoading || !!listProps.error}
            onMarkAllClick={handleMarkAllClick}
            showMarkAll={showMarkAllButton}
          />
        </PopoverHeader>
        <PopoverBody maxH={maxH} display="flex" flexDir="column">
          <NotificationRecordList {...listProps} height="100%" flex={1} maxH="50vh" />

          {showViewAllButton && (
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
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
