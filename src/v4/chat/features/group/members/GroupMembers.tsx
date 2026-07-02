import { Header } from '~/v4/chat/features/group/members/components/Header';
import { MemberTabs } from '~/v4/chat/features/group/members/components/MemberTabs';
import { useGroupMembers } from '~/v4/chat/features/group/members/hooks/useGroupMembers';
import type { GroupMemberListPageProps } from '~/v4/chat/pages/GroupMemberListPage';
import styles from './GroupMembers.module.css';

export function GroupMembers(props: GroupMemberListPageProps) {
  const { channelId, isViewerModerator, handleBack, handleOpenAddMember } = useGroupMembers(props);

  return (
    <div className={styles.groupMembers}>
      <Header
        onBack={handleBack}
        isViewerModerator={isViewerModerator}
        onAddMember={handleOpenAddMember}
      />
      <MemberTabs channelId={channelId} />
    </div>
  );
}
