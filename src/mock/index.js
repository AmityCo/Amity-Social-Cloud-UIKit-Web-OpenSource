import React, { useContext, useMemo, useState } from 'react';

const userFeed = [
  {
    id: 1,
    author: { name: 'John' },
    text:
      'text\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\n',
    images: [
      {
        id: 1,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 2,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
      {
        id: 3,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 4,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
      {
        id: 5,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 6,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
    ],
  },
  {
    id: 2,
    author: { name: 'John' },
    text: 'text text text',
  },
];

const newsFeed = [
  {
    id: 2,
    author: { communityId: '5', name: 'Harry Potter Fans', isPrivate: true },
    text: 'News feed post',
  },
];

const defaultCommunityFeed = [
  {
    id: 1,
    text: 'News feed post',
  },
];

export const communities = [
  { communityId: '1', name: 'Billie Ellish Fans' },
  { communityId: '2', name: 'BLACKPINK TH', verified: true },
  { communityId: '3', name: 'Breakfast Club' },
  { communityId: '4', name: 'BTS & ARMY' },
  { communityId: '5', name: 'Harry Potter Fans', isPrivate: true },
  { communityId: '6', name: 'Very long name very very long name name', isPrivate: true },
];

const communityFeeds = communities.map(community => [
  {
    id: '1',
    author: community,
    text: 'Community post',
  },
]);

export const MockDataContext = React.createContext();

export const MockDataProvider = props => {
  const [data, setData] = useState({
    communities,
    communityFeeds,
    userFeed,
    newsFeed,
  });

  <MockDataContext.Provider value={data} {...props} />;
};
