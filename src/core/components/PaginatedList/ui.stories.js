import React, { useState } from 'react';

import UiKitPaginatedList from '.';

export default {
  title: 'Ui Only',
};

const randomColor = () => `hsl(${Math.random() * 360}deg, 100%, 50%)`;
const get10Colors = () => new Array(10).fill(0).map(() => randomColor());

export const PaginatedList = () => {
  const [items, setItems] = useState(get10Colors());
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    setItems([...items, ...get10Colors()]);

    if (items.length + 10 === 100) setHasMore(false);
  };

  return (
    <UiKitPaginatedList items={items} hasMore={hasMore} loadMore={loadMore}>
      {(item) => (
        <div key={item} style={{ color: item }}>
          {item}
        </div>
      )}
    </UiKitPaginatedList>
  );
};
