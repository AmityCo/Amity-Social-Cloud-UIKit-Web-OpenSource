import React from 'react';

import ExpandedGrid from './ExpandedGrid';
import TruncateGrid from './TruncatedGrid';

const GalleryGrid = ({ className, items, truncate, onClick, children, itemKeyProp }) => {
  const Component = truncate || items.length <= 4 ? TruncateGrid : ExpandedGrid;

  return (
    <Component className={className} items={items} itemKeyProp={itemKeyProp} onClick={onClick}>
      {children}
    </Component>
  );
};

export default GalleryGrid;
