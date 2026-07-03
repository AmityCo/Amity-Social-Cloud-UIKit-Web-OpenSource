import { Typography } from '~/v4/core/components/Typography/Typography';
import { AddTile, SelectedMember, YouTile } from '~/v4/chat/features/shared/components';
import { useString } from '~/v4/core/localization';
import styles from './MemberGrid.module.css';

type MemberGridProps = {
  currentUser: Amity.User | null | undefined;
  members: Amity.User[];
  onAddMember: () => void;
  onRemoveMember: (userId: string) => void;
};

export function MemberGrid({ currentUser, members, onAddMember, onRemoveMember }: MemberGridProps) {
  const memberLabel = useString('amity_chat_group_members');
  const addMemberLabel = useString('amity_chat_add_member_chip');

  return (
    <section className={styles.memberGrid}>
      <Typography.TitleBold className={styles.memberGrid__heading}>
        {memberLabel}
      </Typography.TitleBold>
      <div className={styles.memberGrid__list}>
        <AddTile onPress={onAddMember} ariaLabel={addMemberLabel} label={addMemberLabel} />
        {currentUser && <YouTile user={currentUser} />}
        {members.map((user) => (
          <SelectedMember key={user.userId} user={user} onRemove={onRemoveMember} />
        ))}
      </div>
    </section>
  );
}
