import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { GroupSetting } from '~/v4/chat/features/group/setting';

export type GroupSettingPageProps = {
  channelId: string;
};

export function GroupSettingPage({ channelId }: GroupSettingPageProps) {
  const pageId = CHAT_PAGE_IDS.GROUP_SETTING_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <GroupSetting channelId={channelId} />
    </div>
  );
}
