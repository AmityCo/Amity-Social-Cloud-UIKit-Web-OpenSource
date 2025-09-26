import React, { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { SendMessage } from '~/icons';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';
import { MediaAttachment } from '~/v4/social/components';
import useChannelMembersCollection from '~/chat/hooks/collections/useChannelMembersCollection';
import useUser from '~/core/hooks/useUser';
import useSDK from '~/core/hooks/useSDK';
import useImage from '~/core/hooks/useImage';

interface MessageComposeBarProps {
  channelId: string;
  onSubmit: (message: string, mentions?: Amity.UserMention[]) => void;
}

interface MentionableUser {
  userId: string;
  displayName: string;
  user: Amity.User;
}

// Component for rendering user avatar in mentions dropdown
const MentionUserAvatar = ({ user }: { user: Amity.User }) => {
  const avatarFileUrl = useImage({ fileId: user.avatarFileId, imageSize: 'small' });

  if (avatarFileUrl) {
    return (
      <img
        src={avatarFileUrl}
        alt={user.displayName || user.userId}
        className={styles.mentionUserAvatar}
      />
    );
  }

  // Show initials as fallback
  const initials = (user.displayName || user.userId)
    .split(' ')
    .map((name) => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  return <div className={styles.mentionUserAvatarPlaceholder}>{initials}</div>;
};

const MessageComposeBar = ({ channelId, onSubmit }: MessageComposeBarProps) => {
  // State management
  const [message, setMessage] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartPos, setMentionStartPos] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const mentionsRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { formatMessage } = useIntl();
  const { currentUserId } = useSDK();
  const { channelMembers } = useChannelMembersCollection(channelId);

  // Computed values
  const mentionableUsers: MentionableUser[] = (channelMembers || [])
    .filter((member) => member.user && member.user.userId !== currentUserId)
    .map((member) => ({
      userId: member.user!.userId,
      displayName: member.user!.displayName || member.user!.userId,
      user: member.user!,
    }));

  const filteredUsers = mentionableUsers.filter((user) =>
    user.displayName.toLowerCase().includes(mentionQuery.toLowerCase()),
  );

  // Mention detection and handling
  const detectMentionInText = (text: string, cursorPosition: number) => {
    const beforeCursor = text.slice(0, cursorPosition);
    const lastAtIndex = beforeCursor.lastIndexOf('@');

    if (lastAtIndex === -1) {
      return { shouldShowMentions: false };
    }

    // Check if there's a space or start of string before @
    const charBeforeAt = lastAtIndex === 0 ? ' ' : beforeCursor[lastAtIndex - 1];
    if (charBeforeAt !== ' ' && lastAtIndex !== 0) {
      return { shouldShowMentions: false };
    }

    const afterAt = beforeCursor.slice(lastAtIndex + 1);

    // Hide mentions if there's a space after @
    if (afterAt.includes(' ')) {
      return { shouldShowMentions: false };
    }

    return {
      shouldShowMentions: true,
      mentionStartPosition: lastAtIndex,
      query: afterAt,
    };
  };

  const updateMentionState = (shouldShow: boolean, startPos = -1, query = '') => {
    setShowMentions(shouldShow);
    setMentionStartPos(startPos);
    setMentionQuery(query);
    if (shouldShow) {
      setSelectedMentionIndex(0);
    }
  };

  const insertMentionIntoMessage = (user: MentionableUser) => {
    const beforeMention = message.slice(0, mentionStartPos);
    const afterMention = message.slice(mentionStartPos + mentionQuery.length + 1);
    return `${beforeMention}@${user.displayName} ${afterMention}`;
  };

  const moveCursorAfterMention = (user: MentionableUser) => {
    if (!inputRef.current) return;

    const beforeMention = message.slice(0, mentionStartPos);
    const cursorPosition = beforeMention.length + user.displayName.length + 2; // +2 for @space

    setTimeout(() => {
      inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const extractMentionsFromText = (text: string): Amity.UserMention[] => {
    const mentions: Amity.UserMention[] = [];
    // Match @ only at start of string or after a space
    const mentionRegex = /(^|\s)@(\w+)/g;
    const userIds: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionedDisplayName = match[2]; // Group 2 contains the username
      const mentionedUser = mentionableUsers.find(
        (user) => user.displayName === mentionedDisplayName,
      );

      if (mentionedUser) {
        userIds.push(mentionedUser.userId);
      }
    }

    if (userIds.length > 0) {
      mentions.push({
        type: 'user',
        userIds,
      } as Amity.UserMention);
    }

    return mentions;
  };

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    setMessage(newValue);

    const mentionDetection = detectMentionInText(newValue, cursorPos);

    if (mentionDetection.shouldShowMentions) {
      updateMentionState(true, mentionDetection.mentionStartPosition, mentionDetection.query);
    } else {
      updateMentionState(false);
    }
  };

  const handleMentionSelection = (user: MentionableUser) => {
    if (mentionStartPos === -1) return;

    const newMessage = insertMentionIntoMessage(user);
    setMessage(newMessage);
    updateMentionState(false);

    // Focus input and move cursor
    if (inputRef.current) {
      inputRef.current.focus();
      moveCursorAfterMention(user);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showMentions || filteredUsers.length === 0) {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev < filteredUsers.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev > 0 ? prev - 1 : filteredUsers.length - 1));
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredUsers[selectedMentionIndex]) {
          handleMentionSelection(filteredUsers[selectedMentionIndex]);
        }
        break;
      case 'Escape':
        updateMentionState(false);
        break;
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const mentions = extractMentionsFromText(message);
    onSubmit(message, mentions.length > 0 ? mentions : undefined);
    setMessage('');
    updateMentionState(false);
  };

  // Close mentions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mentionsRef.current &&
        !mentionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowMentions(false);
      }
    };

    if (showMentions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMentions]);

  return (
    <div className={styles.messageComposeBarContainer}>
      <MediaAttachment pageId={'*'} isVisibleCamera />
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          className={styles.messageComposeBarInput}
          data-testid="message-compose-bar-input"
          type="text"
          value={message}
          placeholder={formatMessage({ id: 'MessageComposeBar.placeholder' })}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {showMentions && (
          <div ref={mentionsRef} className={styles.mentionsDropdown}>
            {filteredUsers.length > 0 &&
              filteredUsers.map((user, index) => (
                <div
                  key={user.userId}
                  onClick={() => handleMentionSelection(user)}
                  className={`${styles.mentionUserItem} ${
                    index === selectedMentionIndex ? styles.selected : ''
                  }`}
                  onMouseEnter={() => setSelectedMentionIndex(index)}
                >
                  <MentionUserAvatar user={user.user} />
                  <span className={styles.mentionUsername}>{user.displayName}</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <SendMessage
        className={styles.sendMessageIcon}
        data-testid="message-compose-bar-send-message-button"
        onClick={handleSendMessage}
        width={32}
        height={32}
      />
    </div>
  );
};

export default (props: MessageComposeBarProps) => {
  const CustomComponentFn = useCustomComponent<MessageComposeBarProps>('MessageComposerBar');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <MessageComposeBar {...props} />;
};
