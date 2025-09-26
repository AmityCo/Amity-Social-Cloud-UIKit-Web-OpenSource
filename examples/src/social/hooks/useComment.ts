import { CommentRepository } from '@amityco/ts-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

const useComment = (commentId?: string) => {
  return useLiveObject({
    fetcher: CommentRepository.getComment,
    params: commentId as string,
    shouldCall: () => !!commentId,
  });
  // const [comment, setComment] = useState<Amity.Comment | null>(null);
  // const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  // const unsubscribeComment = useRef(() => {});

  // useEffect(() => {
  //   async function run() {
  //     if (commentId == null) return;
  //     const unsubscribe = await CommentRepository.getComment(commentId, (response) => {
  //       setComment(response.data as Amity.Comment);
  //     });

  //     unsubscribeComment.current = unsubscribe;
  //   }
  //   run();
  //   return () => {
  //     unsubscribeComment.current();
  //   };
  // }, [commentId]);

  // const isCommentReady = !!comment?.commentId;

  // const userId = comment?.userId;
  // const referenceId = comment?.referenceId;
  // const referenceType = comment?.referenceType;

  // // const { user: commentAuthor, file: commentAuthorAvatar } = useUser(userId);

  // useEffect(() => {
  //   async function run() {
  //     const newFlagValue = comment?.commentId
  //       ? await CommentRepository.isCommentFlaggedByMe(comment.commentId)
  //       : false;
  //     setIsFlaggedByMe(newFlagValue);
  //   }
  //   run();
  // }, [comment]);

  // const handleReportComment = async () => {
  //   if (commentId == null) return;
  //   return isFlaggedByMe
  //     ? await CommentRepository.unflagComment(commentId)
  //     : await CommentRepository.flagComment(commentId);
  // };

  // const handleReplyToComment = (
  //   replyCommentText: string,
  //   mentionees: Amity.UserMention[],
  //   metadata: Record<string, unknown>,
  // ) => {
  //   if (!referenceType || !referenceId) return;

  //   CommentRepository.createComment({
  //     referenceType,
  //     referenceId,
  //     data: {
  //       text: replyCommentText,
  //     },
  //     parentId: commentId,
  //     metadata,
  //     mentionees,
  //   });
  // };

  // const handleEditComment = (
  //   text: string,
  //   mentionees: Amity.UserMention[],
  //   metadata: Record<string, unknown>,
  // ) =>
  //   commentId &&
  //   CommentRepository.updateComment(commentId, {
  //     data: {
  //       text,
  //     },
  //     metadata,
  //     mentionees,
  //   });

  // const handleDeleteComment = () => commentId && CommentRepository.deleteComment(commentId);

  // return {
  //   isCommentReady,
  //   comment,
  //   commentAuthor,
  //   commentAuthorAvatar,
  //   handleReportComment,
  //   handleReplyToComment,
  //   handleEditComment,
  //   handleDeleteComment,
  //   isFlaggedByMe,
  // };
};

export default useComment;
