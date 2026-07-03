import { useAmityPage } from '~/v4/core/hooks/uikit';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { EditGroupProfile } from '~/v4/chat/features/group/edit-profile';

export type EditGroupProfilePageProps = {
  channelId: string;
};

export function EditGroupProfilePage({ channelId }: EditGroupProfilePageProps) {
  const pageId = CHAT_PAGE_IDS.EDIT_GROUP_PROFILE_PAGE;
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <EditGroupProfile channelId={channelId} />
    </div>
  );
}
