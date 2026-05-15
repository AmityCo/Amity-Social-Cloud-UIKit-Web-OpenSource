import React, { useEffect } from 'react';
import { useString } from '~/v4/core/localization';
import { CustomRenderer, Tester } from './types';

export const renderer: CustomRenderer = ({ story, action }) => {
  const storyCouldNotBeLoadedLabel = useString('amity_social_label_story_could_not_be_loaded');

  useEffect(() => {
    action('play');
  }, [story]);

  return (
    <div style={styles.storyContent}>
      <p style={styles.text}>{storyCouldNotBeLoadedLabel}</p>
    </div>
  );
};

const styles = {
  storyContent: {
    width: '100%',
    maxHeight: '100%',
    margin: 'auto',
  },
  text: {
    textAlign: 'center' as const,
    color: 'white',
    width: '90%',
    margin: 'auto',
  },
};

export const tester: Tester = () => {
  return {
    condition: true,
    priority: 1,
  };
};

export default {
  renderer,
  tester,
};
