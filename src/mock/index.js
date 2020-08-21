import React, { useContext, useMemo, useState } from 'react';

export const testUser = {
  name: 'Donald Trump',
  avatar:
    'https://www.thenation.com/wp-content/uploads/2020/08/donald-trump-spacex-speech-gty-img.jpg',
};

export const userFeed = [
  {
    id: 1,
    author: testUser,
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
    author: testUser,
    text: 'text text text',
  },
];

export const myCommunities = [
  {
    communityId: '1',
    name: 'Billie Ellish Fans',
    avatar:
      'https://cdn.vox-cdn.com/thumbor/VetxE6rRTJt5tLhQ2Z99QFA9zcI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/16127988/56973906_1031440620389086_5150401069125206016_o.jpg',
  },
  {
    communityId: '2',
    name: 'BLACKPINK TH',
    verified: true,
    avatar: 'https://i.pinimg.com/originals/2c/69/c5/2c69c5959858e4119322698da738bb44.jpg',
  },
  {
    communityId: '3',
    name: 'Breakfast Club',
    avatar:
      'https://simply-delicious-food.com/wp-content/uploads/2018/10/breakfast-board-500x500.jpg',
  },
  {
    communityId: '4',
    name: 'BTS & ARMY',
    avatar: 'https://pbs.twimg.com/profile_images/1219274759034363905/BfWdIBVk.jpg',
  },
  {
    communityId: '5',
    name: 'Harry Potter Fans',
    isPrivate: true,
    avatar: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2019/09/voldemort-3.jpg',
  },
  {
    communityId: '6',
    name: 'Very long name very very long name name',
    isPrivate: true,
    avatar:
      'https://i.guim.co.uk/img/media/788dbbce44c1846fab9da460f64d23d02754a143/362_0_776_1626/master/776.jpg?width=300&quality=45&auto=format&fit=max&dpr=2&s=91c98c71c708b039e9fc3eed87177d6c',
  },
];

const communityFeeds = myCommunities.map(community => [
  {
    id: '1',
    author: community,
    text: 'Community post',
  },
]);

export const testNewsFeed = [
  {
    id: 1,
    author: myCommunities[3],
    text: 'News feed post',
  },
  {
    id: 2,
    author: myCommunities[2],
    text: 'News feed post',
  },
];

const defaultCommunityFeed = [
  // {
  //   id: 1,
  //   text: 'News feed post',
  // },
];

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

export const testFiles = [
  {
    filename: 'text.txt',
    size: 259,
  },
  {
    filename: 'book.pdf',
    size: 223893,
  },
  {
    filename: 'podcast.ogg',
    size: 2293893,
  },
  {
    filename: 'movie.avi',
    size: 229389322,
  },
  {
    filename: 'page.html',
    size: 1024,
  },
  {
    filename: 'presentation.ppt',
    size: 2139232,
  },
  {
    filename: 'archive.zip',
    size: 123123132923,
  },
  {
    filename: 'filename.audio',
    size: 12323,
  },
  {
    filename: 'filename.ogg',
    size: 12323,
  },
  {
    filename: 'filename.aac',
    size: 12323,
  },
  {
    filename: 'filename.avi',
    size: 12323,
  },
  {
    filename: 'filename.csv',
    size: 12323,
  },
  {
    filename: 'filename.doc',
    size: 12323,
  },
  {
    filename: 'filename.exe',
    size: 12323,
  },
  {
    filename: 'filename.html',
    size: 12323,
  },
  {
    filename: 'filename.jpg',
    size: 12323,
  },
  {
    filename: 'filename.png',
    size: 12323,
  },
  {
    filename: 'filename.gif',
    size: 12323,
  },
  {
    filename: 'filename.mov',
    size: 12323,
  },
  {
    filename: 'filename.mp3',
    size: 12323,
  },
  {
    filename: 'filename.mp4',
    size: 12323,
  },
  {
    filename: 'filename.mpeg',
    size: 12323,
  },
  {
    filename: 'filename.pdf',
    size: 12323,
  },
  {
    filename: 'filename.ppt',
    size: 12323,
  },
  {
    filename: 'filename.ppx',
    size: 12323,
  },
  {
    filename: 'filename.rar',
    size: 12323,
  },
  {
    filename: 'filename.txt',
    size: 12323,
  },
  {
    filename: 'filename.xls',
    size: 12323,
  },
  {
    filename: 'filename.zip',
    size: 12323,
  },
];

export const testImages = [
  {
    url:
      'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  },
  {
    url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
  },
];
