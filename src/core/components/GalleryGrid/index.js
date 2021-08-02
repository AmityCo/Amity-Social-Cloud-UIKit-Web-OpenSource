import React from 'react';

import ExpandedGrid from './ExpandedGrid';
import TruncateGrid from './TruncatedGrid';

const GalleryGrid = ({ className, items, truncate, onClick, children, itemKeyProp }) => {
  const Component = truncate || items.length <= 4 ? TruncateGrid : ExpandedGrid;

  return (
    <Component className={className} items={items} onClick={onClick} itemKeyProp={itemKeyProp}>
      {children}
    </Component>
  );
};

export default GalleryGrid;
