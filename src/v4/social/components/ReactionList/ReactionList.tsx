import React, { Fragment, useState } from 'react';
import Avatar from '~/core/components/Avatar';
import { FireIcon, HeartIcon, LikedIcon } from '~/icons';
import styles from './ReactionList.module.css';
import { useReactionsCollection } from '../../hooks';
import { Typography } from '~/v4/core/components';

interface ReactionListProps {
  referenceId: string;
  referenceType: Amity.ReactableType;
}

type ReactionType = 'like' | 'love' | 'fire';
type ReactionTabType = ReactionType | 'All';

export const ReactionList = ({ referenceId, referenceType }: ReactionListProps) => {
  const { reactions } = useReactionsCollection({ referenceId, referenceType });
  const [activeTab, setActiveTab] = useState('All');

  const handleTabClick = (tab: ReactionTabType) => {
    setActiveTab(tab);
  };

  const filteredReactions =
    activeTab === 'All'
      ? reactions
      : reactions.filter((reaction) => reaction.reactionName === activeTab.toLowerCase());

  if (reactions == null) return null;

  return (
    <div className={styles.reactionListContainer}>
      <div className={styles.tabList}>
        <div
          className={`${styles.tabItem} ${activeTab === 'All' ? styles.active : ''}`}
          onClick={() => handleTabClick('All')}
        >
          <Typography.Title>
            <span className={styles.reactionEmoji}>
              All <span className={styles.tabCount}>{reactions.length}</span>
            </span>
          </Typography.Title>
        </div>
        {(['like', 'love', 'fire'] as ReactionType[]).map((reactionType) => {
          const count = reactions.filter(
            (reaction) => reaction.reactionName === reactionType,
          ).length;
          return (
            <div
              key={reactionType}
              className={`${styles.tabItem} ${activeTab === reactionType ? styles.active : ''}`}
              onClick={() => handleTabClick(reactionType)}
            >
              {reactionType === 'like' && (
                <Typography.Title>
                  <span className={styles.reactionEmoji}>
                    <LikedIcon /> <span className={styles.tabCount}>{count}</span>
                  </span>
                </Typography.Title>
              )}
              {reactionType === 'love' && (
                <Typography.Title>
                  <span className={styles.reactionEmoji}>
                    <HeartIcon /> <span className={styles.tabCount}>{count}</span>
                  </span>
                </Typography.Title>
              )}
              {reactionType === 'fire' && (
                <Typography.Title>
                  <span className={styles.reactionEmoji}>
                    <FireIcon /> <span className={styles.tabCount}>{count}</span>
                  </span>
                </Typography.Title>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.userList}>
        {filteredReactions.map((reaction) => {
          return (
            <Fragment key={reaction.reactionId}>
              <div className={styles.userItem}>
                <div className={styles.userDetailsContainer}>
                  <Avatar size="small" avatar={reaction.user?.avatar?.fileUrl} />
                  <Typography.Body>{reaction.user?.displayName}</Typography.Body>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
