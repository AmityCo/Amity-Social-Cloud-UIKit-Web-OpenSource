import useSDK from '~/core/hooks/useSDK';
import { isModerator } from '~/helpers/permissions';

const useCommentPermission = (
  comment?: Amity.Comment | null,
  readonly: boolean = false,
  userRoles: string[] = [],
) => {
  const { currentUserId } = useSDK();
  const isCommentOwner = comment?.userId === currentUserId;
  const isReplyComment = !!comment?.parentId;

  const canDelete = (!readonly && isCommentOwner) || isModerator(userRoles);
  const canEdit = !readonly && isCommentOwner;
  const canLike = !readonly;
  const canReply = !readonly && !isReplyComment;
  const canReport = !readonly && !isCommentOwner;

  return {
    canDelete,
    canEdit,
    canLike,
    canReply,
    canReport,
  };
};

export default useCommentPermission;
