import React, { forwardRef, MutableRefObject, useEffect, useRef, useState } from 'react';
import Truncate from 'react-truncate-markup';
import { FormattedMessage, useIntl } from 'react-intl';

import Button, { PrimaryButton } from '~/core/components/Button';
import CommentLikeButton from '~/social/components/CommentLikeButton';
import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';

import {
  Avatar,
  Content,
  CommentHeader,
  AuthorName,
  CommentDate,
  InteractionBar,
  ReplyIcon,
  ReplyButton,
  CommentEditContainer,
  CommentEditTextarea,
  ButtonContainer,
  EditedMark,
  OptionMenuContainer,
  OptionButtonContainer,
} from './styles';
import { Mentioned, Metadata, isNonNullable } from '~/helpers/utils';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';
import { Option, OptionsButton, OptionsIcon } from '~/core/components/OptionMenu/styles';
import useCommentFlaggedByMe from '~/social/hooks/useCommentFlaggedByMe';
import { useNotifications } from '~/core/providers/NotificationProvider';
import { useDropdown } from '~/core/components/Dropdown/index';
import useElementSize from '~/core/hooks/useElementSize';
import { Frame, FrameContainer } from '~/core/components/Dropdown/styles';

type OptionMenuProps = StyledCommentProps & {
  onEditCommentClick: () => void;
  onClose: () => void;
  buttonContainerHeight: number;
};

const OptionMenu = ({
  commentId,
  canDelete = false,
  canEdit = false,
  canReport = true,
  handleReportComment,
  startEditing,
  handleDelete,
  isReplyComment,
  onClose,
  buttonContainerHeight,
}: OptionMenuProps) => {
  const { formatMessage } = useIntl();
  const notification = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentPosition, align, scrollableHeight } = useDropdown({
    dropdownRef,
    buttonContainerHeight,
  });

  const { isFlaggedByMe: isReported, toggleFlagComment } = useCommentFlaggedByMe(commentId);

  const onReportClick = async () => {
    try {
      await toggleFlagComment();
      handleReportComment?.();
      if (isReported) {
        notification.success({
          content: formatMessage({ id: 'report.unreportSent' }),
        });
      } else {
        notification.success({
          content: formatMessage({ id: 'report.reportSent' }),
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        notification.error({
          content: err.message,
        });
      }
    }
  };

  const options = [
    canEdit
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.edit' })
            : formatMessage({ id: 'comment.edit' }),
          action: startEditing,
        }
      : null,
    canReport
      ? {
          name: isReported
            ? formatMessage({ id: 'report.undoReport' })
            : formatMessage({ id: 'report.doReport' }),
          action: onReportClick,
        }
      : null,
    canDelete
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.delete' })
            : formatMessage({ id: 'comment.delete' }),
          action: handleDelete,
        }
      : null,
  ].filter(isNonNullable);

  return (
    <OptionMenuContainer ref={dropdownRef}>
      <FrameContainer>
        <Frame position={currentPosition} align={align} scrollableHeight={scrollableHeight}>
          {options.map(({ name, action }) => (
            <Option
              key={name}
              data-qa-anchor={`post-options-button-${name}`}
              onClick={() => {
                action?.();
                onClose();
              }}
            >
              {name}
            </Option>
          ))}
        </Frame>
      </FrameContainer>
    </OptionMenuContainer>
  );
};

interface StyledCommentProps {
  commentId?: string;
  authorName?: string;
  authorAvatar?: string;
  canDelete?: boolean;
  canEdit?: boolean;
  canLike?: boolean;
  canReply?: boolean;
  canReport?: boolean;
  createdAt?: Date;
  editedAt?: Date;
  text?: string;
  markup?: string;
  onClickReply?: () => void;
  handleReportComment?: () => void;
  handleEdit?: (text?: string) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  handleDelete: () => void;
  isEditing?: boolean;
  onChange: (data: {
    text: string;
    plainText: string;
    lastMentionText?: string | undefined;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
  queryMentionees: QueryMentioneesFnType;
  isReported?: boolean;
  isReplyComment?: boolean;
  isBanned?: boolean;
  mentionees?: Mentioned[];
  metadata?: Metadata;
  onClickUser?: () => void;
}

const StyledComment = (props: StyledCommentProps) => {
  const {
    commentId,
    authorName,
    authorAvatar,
    canLike = true,
    canReply = false,
    createdAt,
    editedAt,
    text,
    markup,
    onClickReply,
    handleEdit,
    startEditing,
    cancelEditing,
    isEditing,
    onChange,
    queryMentionees,
    isBanned,
    mentionees,
    onClickUser,
  } = props;
  const { formatMessage } = useIntl();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonContainerRef, buttonContainerHeight] = useElementSize();

  const toggle = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', toggle);
    } else {
      document.removeEventListener('click', toggle);
    }

    return () => {
      document.removeEventListener('click', toggle);
    };
  }, [isMenuOpen]);

  return (
    <>
      <Avatar onClick={onClickUser} avatar={authorAvatar} backgroundImage={UserImage} />
      <Content>
        <Truncate
          ellipsis={
            <span>
              ...
              <CommentDate date={createdAt?.getTime()} />
              {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
                <EditedMark>
                  <FormattedMessage id="comment.edited" />
                </EditedMark>
              )}
            </span>
          }
          lines={2}
        >
          <CommentHeader>
            <AuthorName onClick={onClickUser}>{authorName}</AuthorName>

            <Truncate.Atom>
              <>
                {isBanned && (
                  <BanIcon
                    style={{
                      marginLeft: '0.265rem',
                      marginTop: '1px',
                    }}
                  />
                )}
                <CommentDate date={createdAt?.getTime()} />
                {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
                  <EditedMark>
                    <FormattedMessage id="comment.edited" />
                  </EditedMark>
                )}
              </>
            </Truncate.Atom>
          </CommentHeader>
        </Truncate>

        {isEditing ? (
          <CommentEditContainer>
            <CommentEditTextarea
              multiline
              mentionAllowed
              value={markup}
              queryMentionees={queryMentionees}
              onChange={(data) => onChange?.(data)}
            />
            <ButtonContainer>
              <Button data-qa-anchor="comment-cancel-edit-button" onClick={cancelEditing}>
                <FormattedMessage id="cancel" />
              </Button>
              <PrimaryButton
                data-qa-anchor="comment-save-edit-button"
                onClick={() => handleEdit?.(text)}
              >
                <FormattedMessage id="save" />
              </PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
        ) : (
          <CommentText text={text} mentionees={mentionees} />
        )}

        {!isEditing && (canLike || canReply) && (
          <InteractionBar>
            {canLike && <CommentLikeButton commentId={commentId} />}

            {canReply && (
              <ReplyButton data-qa-anchor="comment-reply-button" onClick={onClickReply}>
                <ReplyIcon /> <FormattedMessage id="reply" />
              </ReplyButton>
            )}

            <OptionButtonContainer>
              <div ref={buttonContainerRef}>
                <OptionsButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toggle();
                  }}
                >
                  <OptionsIcon />
                </OptionsButton>
              </div>
              {isMenuOpen && (
                <OptionMenu
                  {...props}
                  onClose={toggle}
                  onEditCommentClick={() => startEditing()}
                  buttonContainerHeight={buttonContainerHeight}
                />
              )}
            </OptionButtonContainer>
          </InteractionBar>
        )}
      </Content>
    </>
  );
};

export default StyledComment;
