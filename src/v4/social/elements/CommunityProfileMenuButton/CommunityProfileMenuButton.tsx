import clsx from 'clsx';
import { useCallback } from 'react';
import { Menu } from '~/v4/icons/Menu';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CommunityProfileMenuButton.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { IconButton } from '~/v4/core/components/IconButton';
import useCommunityModeratorsCollection from '~/v4/social/hooks/collections/useCommunityModeratorsCollection';
import Users from '~/v4/icons/Users';
import useSDK from '~/v4/core/hooks/useSDK';
import Setting from '~/v4/icons/Setting';
import { AmitySharableContentType } from '@amityco/ts-sdk';

export type CommunityProfileMenuButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  community?: Amity.Community;
  defaultIconClassName?: string;
};

export function CommunityProfileMenuButton({
  onPress,
  className,
  pageId = '*',
  componentId = '*',
  defaultIconClassName,
  community,
  ...props
}: CommunityProfileMenuButtonProps) {
  const elementId = 'menu_button';

  const { isDesktop } = useResponsive();
  const { AmityCommunityProfilePageBehavior } = usePageBehavior();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { currentUserId, isVisitorOrBot } = useSDK();
  const { moderators } = useCommunityModeratorsCollection({ communityId: community?.communityId });
  const {
    isExcluded,
    accessibilityId,
    themeStyles,
    config,
    defaultConfig,
    uiReference,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const goToCommunitySettingPage = () => {
    if (!isDesktop) removeDrawerData();
    community &&
      AmityCommunityProfilePageBehavior?.goToCommunitySettingPage?.({
        community: community,
      });
  };

  const isCommunityModerator = moderators.some((moderator) => moderator.userId === currentUserId);
  const isMember = community?.isJoined;

  if (isVisitorOrBot) return null;

  const shouldShowCopyButton =
    community?.isPublic || community?.isDiscoverable || isCommunityModerator;

  const renderMenu = useCallback(
    ({ closePopover }: { closePopover?: () => void } = {}) => {
      return (
        <div className={styles.menuButton__wrapper}>
          {isCommunityModerator && (
            <IconButton
              className={styles.menuButton__optionButton}
              pageId={pageId}
              componentId={componentId}
              elementId={elementId}
              variant="text"
              text={resolveText('amity_social_setting_community_settings')}
              defaultIcon={<Setting className={styles.menuButton__optionButton__icon} />}
              onPress={goToCommunitySettingPage}
              typographyVariant="bodyBold"
            />
          )}
          {isMember && !isCommunityModerator && (
            <IconButton
              className={styles.menuButton__optionButton}
              pageId={pageId}
              componentId={componentId}
              elementId={elementId}
              variant="text"
              text={resolveText('amity_social_label_community_information_title')}
              defaultIcon={<Users className={styles.menuButton__optionButton__icon} />}
              onPress={goToCommunitySettingPage}
              typographyVariant="bodyBold"
            />
          )}
          {shouldShowCopyButton && (
            <CopyLinkButton
              pageId={pageId}
              componentId={componentId}
              model={AmitySharableContentType.COMMUNITY}
              referenceId={community?.communityId}
              onDone={isDesktop ? removeDrawerData : closePopover}
              textId="amity_social_label_copy_profile_link"
            />
          )}
        </div>
      );
    },
    [isCommunityModerator, isMember],
  );

  if (isExcluded) return null;

  return (
    <Popover
      trigger={({ openPopover }) => (
        <Button
          {...props}
          onPress={
            isDesktop
              ? openPopover
              : () =>
                  setDrawerData({
                    content: renderMenu(),
                  })
          }
          style={themeStyles}
          data-testid={accessibilityId}
          className={clsx(styles.menuButton, className)}
          aria-label="Menu icon to open community profile settings page"
        >
          <IconComponent
            configIconName={config.icon}
            defaultIconName={defaultConfig.icon}
            imgIcon={() => <img src={config.icon} alt={uiReference} />}
            defaultIcon={() => (
              <Menu className={clsx(styles.menuButton__icon, defaultIconClassName)} />
            )}
          />
        </Button>
      )}
    >
      {({ closePopover }) => renderMenu({ closePopover })}
    </Popover>
  );
}
