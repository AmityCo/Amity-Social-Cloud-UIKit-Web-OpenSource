import React, { useEffect } from 'react';
import { CustomRenderer, Tester } from './types';

export const renderer: CustomRenderer = ({ story, action }) => {
  useEffect(() => {
    action('play');
  }, [story]);

  return (
    <div style={styles.storyContent}>
      <p style={styles.text}>This story could not be loaded.</p>
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
