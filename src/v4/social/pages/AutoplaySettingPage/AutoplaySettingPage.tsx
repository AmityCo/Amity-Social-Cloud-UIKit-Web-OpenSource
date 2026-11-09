import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';
import { AutoplaySetting } from '~/v4/social/features/users';

export type AutoplaySettingPageProps = Record<string, never>;

export function AutoplaySettingPage() {
  const pageId = PAGE_ID.AUTOPLAY_SETTING_PAGE;
  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({ pageId });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <AutoplaySetting pageId={pageId} />
    </div>
  );
}
