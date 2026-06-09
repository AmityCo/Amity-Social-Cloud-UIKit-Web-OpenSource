import React from 'react';
import styles from './icons.style.module.css';

export default {
  title: 'v4/assets/icons/Icons',
};

export const Default = {
  render: () => {
    return (
      <section
        className={styles.container}
        onClick={(e) => {
          if (e.target instanceof HTMLButtonElement) {
            const iconName = e.target.getAttribute('data-name');
            if (iconName) {
              navigator.clipboard.writeText(iconName).then(() => {
                alert(`${iconName} copied.`);
              });
            }
          }
        }}
      >
        [ICONS]
      </section>
    );
  },
};
