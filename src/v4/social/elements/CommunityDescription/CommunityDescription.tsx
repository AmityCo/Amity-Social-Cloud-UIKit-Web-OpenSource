import React, { useState, useRef, useEffect } from 'react';
import styles from './CommunityDescription.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/natives/Button';

interface CommunityDescriptionProps {
  description: string;
  pageId?: string;
  componentId?: string;
}

export const CommunityDescription: React.FC<CommunityDescriptionProps> = ({
  pageId = '*',
  componentId = '*',
  description = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const elementId = 'community_description';
  const { themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  const maxLength = 180;

  const truncatedText =
    description.length > maxLength ? description.slice(0, maxLength) : description;

  useEffect(() => {
    if (descriptionRef.current) {
      setShowToggle(description.length > maxLength);
    }
  }, [description]);

  if (isExcluded) return null;

  const expandText = () => setIsExpanded(true);

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles} className={styles.descriptionWrapper}>
      <div
        ref={descriptionRef}
        className={`${styles.description} ${isExpanded ? styles.expanded : ''}`}
      >
        <Typography.Body>
          {isExpanded ? description : truncatedText}{' '}
          {showToggle && !isExpanded && (
            <Button onPress={expandText} className={styles.toggleButton}>
              {' '}
              ...See more
            </Button>
          )}
        </Typography.Body>
      </div>
    </div>
  );
};
