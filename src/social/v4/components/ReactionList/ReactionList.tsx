import React, { Fragment, useState } from 'react';

import Avatar from '~/core/components/Avatar';
import { Typography } from '~/core/v4/components';
import { FireIcon, HeartIcon, LikedIcon } from '~/icons';
import { useReactionsCollection } from '~/social/v4/hooks/collections/useReactionsCollection';
import {
  ReactionListContainer,
  TabList,
  TabItem,
  ReactionEmoji,
  TabCount,
  UserList,
  UserItem,
  UserDetailsContainer,
} from './styles';
import { ReactionListProps } from '.';

export const ReactionList: React.FC<ReactionListProps> = ({ referenceId, referenceType }) => {
  const { reactions } = useReactionsCollection({
    referenceId,
    referenceType,
  });

  const [activeTab, setActiveTab] = useState('All');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const filteredReactions =
    activeTab === 'All'
      ? reactions
      : reactions.filter((reaction) => reaction.reactionName === activeTab.toLowerCase());

  if (reactions == null) return null;

  return (
    <ReactionListContainer>
      <TabList>
        <TabItem active={activeTab === 'All'} onClick={() => handleTabClick('All')}>
          <Typography.Title $type="titles">
            <ReactionEmoji>
              All <TabCount>{reactions.length}</TabCount>
            </ReactionEmoji>
          </Typography.Title>
        </TabItem>
        {['like', 'love', 'fire'].map((reactionType) => {
          const count = reactions.filter(
            (reaction) => reaction.reactionName === reactionType,
          ).length;
          return (
            <TabItem
              key={reactionType}
              active={activeTab === reactionType}
              onClick={() => handleTabClick(reactionType)}
            >
              {reactionType === 'like' && (
                <Typography.Title $type="titles">
                  <ReactionEmoji>
                    <LikedIcon /> <TabCount>{count}</TabCount>
                  </ReactionEmoji>
                </Typography.Title>
              )}
              {reactionType === 'love' && (
                <Typography.Title $type="titles">
                  <ReactionEmoji>
                    <HeartIcon /> <TabCount>{count}</TabCount>
                  </ReactionEmoji>
                </Typography.Title>
              )}
              {reactionType === 'fire' && (
                <Typography.Title $type="titles">
                  <ReactionEmoji>
                    <FireIcon /> <TabCount>{count}</TabCount>
                  </ReactionEmoji>
                </Typography.Title>
              )}
            </TabItem>
          );
        })}
      </TabList>
      <UserList>
        {filteredReactions.map((reaction) => {
          return (
            <Fragment key={reaction.reactionId}>
              <UserItem>
                <UserDetailsContainer>
                  <Avatar size="small" avatar={reaction.user?.avatar?.fileUrl} />
                  <Typography.Body $type="body">{reaction.user?.displayName}</Typography.Body>
                </UserDetailsContainer>
              </UserItem>
            </Fragment>
          );
        })}
      </UserList>
    </ReactionListContainer>
  );
};
