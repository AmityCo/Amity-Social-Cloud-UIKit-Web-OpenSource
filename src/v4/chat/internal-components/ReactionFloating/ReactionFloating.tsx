import { getLiveReactionTopic, subscribeTopic } from '@amityco/ts-sdk';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { ReactionObservable, ReactionCount } from '~/v4/core/ReactionEngine';
import styles from './ReactionFloating.module.css';

type FloatingReaction = {
  id: string;
  element: HTMLImageElement;
  x: number;
  y: number;
  direction: number; // 1 or -1
  bound: number; // wiggle size
  scale: number; // affects wiggle frequency
  time: number; // life remaining
  phase: number;
};

interface ReactionFloatingProps {
  post: Amity.Post;
}

export const ReactionFloating: React.FC<ReactionFloatingProps> = ({ post }) => {
  const { config: reactionsConfig } = useCustomReaction();
  const [lanes, setLanes] = useState<ReactionCount[]>();
  const containerRef = useRef<HTMLDivElement>(null);
  const reactionsRef = useRef<FloatingReaction[]>([]);
  const animationFrameId = useRef<number | null>(null);

  const pushReaction = useCallback(
    ({ reactionName }: { reactionName: string }) => {
      const reaction = reactionsConfig.find(
        (reactionConfig) => reactionName === reactionConfig.name,
      );

      if (!reaction || !containerRef.current) return;

      const reactionItem = document.createElement('img');
      reactionItem.src = reaction.image;
      reactionItem.className = styles.reactionFloating__reactionItem;
      reactionItem.style.position = 'absolute';

      // Initial position (bottom center with random lane offset)
      const containerWidth = containerRef.current.offsetWidth;
      const startX = Math.random() * containerWidth * 0.8 + containerWidth * 0.1;
      const startY = containerRef.current.offsetHeight - 50; // start from near the bottom

      reactionItem.style.left = `${startX}px`;
      reactionItem.style.top = `${startY}px`;

      containerRef.current.appendChild(reactionItem);

      reactionsRef.current.push({
        id: uuidv4(),
        element: reactionItem,
        x: startX,
        y: startY,
        direction: Math.random() < 0.5 ? -1 : 1,
        bound: Math.random() * 5, // wiggle range
        scale: Math.random() * 0.5 + 0.75, // wiggle speed factor
        time: 3000, // live for 3 seconds
        phase: Math.random() * Math.PI * 2,
      });
    },
    [reactionsConfig],
  );

  const animate = useCallback(() => {
    let before = Date.now();

    const frame = () => {
      const current = Date.now();
      const deltaTime = current - before;
      before = current;

      const containerWidth = containerRef.current?.offsetWidth || 0;

      reactionsRef.current.forEach((reaction, index) => {
        const reactionWidth = reaction.element.offsetWidth;

        reaction.time -= deltaTime;

        if (reaction.time > 0) {
          // Move up
          reaction.y -= 0.1 * deltaTime;

          // Wiggle left and right
          reaction.element.style.top = `${reaction.y}px`;

          let targetX =
            reaction.x +
            reaction.direction *
              reaction.bound *
              Math.sin((reaction.y * reaction.scale) / 30 + reaction.phase);
          // Clamp the position to stay inside container
          targetX = Math.max(0, Math.min(containerWidth - reactionWidth, targetX));
          reaction.element.style.left = `${targetX}px`;
        } else {
          // Remove from DOM
          if (reaction.element.parentNode) {
            reaction.element.parentNode.removeChild(reaction.element);
          }
          reactionsRef.current.splice(index, 1);
        }
      });

      animationFrameId.current = requestAnimationFrame(frame);
    };

    animationFrameId.current = requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const topicSubscription = subscribeTopic(getLiveReactionTopic(post));
    let unsubscribe: (() => void) | undefined;

    if (containerRef?.current && reactionsConfig.length > 0 && post.postId) {
      const reactionObservable = new ReactionObservable(post.postId);
      unsubscribe = reactionObservable.subscribe((reactions) => {
        setLanes([...reactions]);
      });
    }

    return () => {
      topicSubscription();
      unsubscribe?.();
    };
  }, [containerRef, reactionsConfig.length, post.postId]);

  useEffect(() => {
    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    if (lanes) {
      lanes.forEach((lane) => {
        for (let i = 0; i < lane.count; i++) {
          setTimeout(() => pushReaction({ reactionName: lane.reactionName }), Math.random() * 1000);
        }
      });
    }
  }, [lanes]);

  return <div ref={containerRef} className={styles.reactionFloating__container}></div>;
};
