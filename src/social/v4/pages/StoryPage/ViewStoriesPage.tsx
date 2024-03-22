import React from 'react';
import StoryViewer from '~/social/v4/internal-components/StoryViewer';
import { usePageBehavior } from '~/social/v4/providers/PageBehaviorProvider';

interface ViewStoriesPageProps {
  pageId: 'story_page';
  targetId: string;
  onClose: () => void;
}

export const ViewStoriesPage = ({ pageId = 'story_page', targetId }: ViewStoriesPageProps) => {
  const { navigationBehavior } = usePageBehavior();
  return (
    <StoryViewer pageId={pageId} targetId={targetId} onClose={navigationBehavior.closeAction} />
  );
};
