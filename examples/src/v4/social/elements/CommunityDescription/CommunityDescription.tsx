import React, { useState } from 'react';
import Truncate from 'react-truncate-markup';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityDescription.module.css';

type CommunityDescriptionProps = {
  pageId?: string;
  description: string;
  componentId?: string;
};

export const CommunityDescription: React.FC<CommunityDescriptionProps> = ({
  pageId = '*',
  componentId = '*',
  description = '',
}) => {
  const elementId = 'community_description';

  const [isExpanded, setIsExpanded] = useState(false);
  const { themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    elementId,
    componentId,
  });

  const expandText = () => setIsExpanded(true);

  if (isExcluded || description.length === 0) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.communityDescription}>
      <Typography.Body className={styles.communityDescription__text}>
        {isExpanded ? (
          description
        ) : (
          <Truncate
            lines={4}
            ellipsis={
              <>
                ...{' '}
                <Button className={styles.communityDescription__seeMoreButton} onPress={expandText}>
                  See more
                </Button>
              </>
            }
          >
            <div>{description}</div>
          </Truncate>
        )}
      </Typography.Body>
    </div>
  );
};
