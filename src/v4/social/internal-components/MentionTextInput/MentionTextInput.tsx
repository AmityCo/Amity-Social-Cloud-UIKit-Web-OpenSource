import styles from './MentionTextInput.module.css';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import React, { RefObject, useCallback, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { $createMentionNode } from './MentionNodes';
import { CommunityMember } from '~/v4/social/internal-components/CommunityMember';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

function checkForAtSignMentions(text: string, minMatchLength: number): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 0);
}

export class MentionTypeaheadOption extends MenuOption {
  user: Amity.User;

  constructor(user: Amity.User) {
    super(user.userId);
    this.user = user;
  }
}

export const MentionTextInputPlugin = ({ communityId }: { communityId?: string | null }) => {
  const mentionTextInputItemRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div ref={mentionTextInputItemRef}></div>
      <Mention anchorRef={mentionTextInputItemRef} communityId={communityId} />
    </div>
  );
};

function Mention({
  anchorRef,
  communityId,
}: {
  anchorRef: RefObject<HTMLDivElement>;
  communityId?: string | null;
}) {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);
  let options: MentionTypeaheadOption[] = [];
  const intersectionRef = useRef<HTMLDivElement>(null);
  const {
    members,
    hasMore: hasMoreMember,
    isLoading: isLoadingMember,
    loadMore: loadMoreMember,
  } = useMemberQueryByDisplayName({
    communityId: communityId || '',
    displayName: queryString || '',
    limit: 10,
    enabled: !!communityId,
  });
  const { users, hasMore, loadMore, isLoading } = useUserQueryByDisplayName({
    displayName: queryString || '',
    limit: 10,
  });
  useIntersectionObserver({
    onIntersect: () => {
      if (communityId) {
        if (hasMoreMember && isLoadingMember === false) {
          loadMoreMember();
        }
      } else {
        if (hasMore && isLoading === false) {
          loadMore();
        }
      }
    },
    ref: intersectionRef,
  });

  const community = useCommunity({ communityId }).community;
  const isPublic = community?.isPublic;

  if (communityId && !isPublic) {
    options = useMemo(
      () => members.map((member) => new MentionTypeaheadOption(member.user as Amity.User)),
      [members],
    );
  } else {
    options = useMemo(() => users.map((user) => new MentionTypeaheadOption(user)), [users]);
  }

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode({
          mentionName: selectedOption.key,
          displayName: selectedOption.user.displayName,
          userId: selectedOption.user.userId,
        });
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      return getPossibleQueryMatch(text);
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorRef.current && options.length > 0
          ? ReactDOM.createPortal(
              <>
                <div className={styles.mentionTextInput_item}>
                  {options.map((option, i: number) => (
                    <CommunityMember
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </div>
                <div ref={intersectionRef} />
              </>,
              anchorRef.current,
            )
          : null
      }
    />
  );
}
