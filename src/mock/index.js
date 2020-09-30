/* eslint-disable */
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { v4 } from 'uuid';

const description =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor leo et tortor tempor finibus. Phasellus ultrices nulla nec libero ornare bibendum. Etiam nibh tellus, egestas at molestie vel, egestas euismod justo. Duis non dui ipsum. Maecenas mollis sed erat et ultrices. Cras rhoncus bibendum erat, at volutpat justo. ';

export const testUser = {
  userId: 'u1',
  displayName: 'Lalisa Manoban',
  avatar:
    'https://cdn1.i-scmp.com/sites/default/files/styles/768x768/public/images/methode/2018/07/26/bf01d32e-8fcd-11e8-ad1d-4615aa6bc452_1280x720_204951.jpg?itok=lSmaQVob',
  description,
};

export const testUsers = [
  testUser,
  {
    userId: 'u2',
    displayName: 'Jennie Kim',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/9/99/Jennie_Kim_for_Marie_Claire_Korea_Magazine_on_October_9%2C_2018_%285%29.png',
    description,
  },
  {
    userId: 'u3',
    displayName: 'Rosé',
    avatar:
      'https://img1.nickiswift.com/img/gallery/this-is-how-much-blackpinks-rose-is-actually-worth/intro-1579709224.jpg',
    description,
  },
  {
    userId: 'u4',
    displayName: 'Jisoo',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
    description,
  },
  {
    userId: 'u5',
    name: 'Jisoo1',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u6',
    name: 'Jisoo2',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u7',
    name: 'Jisoo3',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u8',
    name: 'Jisoo4',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u9',
    name: 'Jisoo5',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u10',
    name: 'Jisoo6',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u11',
    name: 'Jisoo7',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u12',
    name: 'Jisoo8',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u13',
    name: 'Jisoo9',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u14',
    name: 'Jisoo10',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u15',
    name: 'Jisoo11',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u16',
    name: 'Jisoo12',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u17',
    name: 'Jisoo111',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u18',
    name: 'Jisoo222',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u19',
    name: 'Jisoo333',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
  {
    userId: 'u20',
    name: 'Jisoo555',
    avatar:
      'https://www.allkpop.com/upload/2020/08/content/280446/1598604401-img-20200828-155652.jpg',
  },
];

export const testMembers = testUsers;

export const testModerators = [testUser, testUser];

export const posts = [
  {
    postId: 'p1',
    targetId: 'u1',
    author: testUser,
    text:
      'text\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\n',
    images: [
      {
        id: 1,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        isNew: false,
      },
      {
        id: 2,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
        isNew: false,
      },
      {
        id: 3,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        isNew: false,
      },
      {
        id: 4,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
        isNew: false,
      },
      {
        id: 5,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        isNew: false,
      },
      {
        id: 6,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
        isNew: false,
      },
    ],
  },
  {
    postId: 'p2',
    targetId: 'u1',
    author: testUser,
    text: 'text text text',
  },
];

const communities = [
  {
    communityId: 'c1',
    name: 'Billie Ellish Fans',
    isPublic: true,
    avatar:
      'https://cdn.vox-cdn.com/thumbor/VetxE6rRTJt5tLhQ2Z99QFA9zcI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/16127988/56973906_1031440620389086_5150401069125206016_o.jpg',
    postsCount: 12332,
    description,
  },
  {
    communityId: 'c2',
    name: 'BTS & ARMY',
    isPublic: true,
    avatar: 'https://pbs.twimg.com/profile_images/1219274759034363905/BfWdIBVk.jpg',
    postsCount: 532,
    description,
  },
  {
    communityId: 'c3',
    name: 'Breakfast Club',
    isPublic: true,
    avatar:
      'https://simply-delicious-food.com/wp-content/uploads/2018/10/breakfast-board-500x500.jpg',
    postsCount: 5332,
    description,
  },
  {
    communityId: 'c4',
    name: 'BLACKPINK TH',
    isPublic: true,
    verified: true,
    avatar: 'https://i.pinimg.com/originals/2c/69/c5/2c69c5959858e4119322698da738bb44.jpg',
    postsCount: 123,
    description,
  },
  {
    communityId: 'c5',
    name: 'Harry Potter Fans',
    isPublic: false,
    avatar: 'https://static3.srcdn.com/wordpress/wp-content/uploads/2019/09/voldemort-3.jpg',
    postsCount: 23,
    description,
  },
  {
    communityId: 'c6',
    name: 'Very long name very very long name name',
    isPublic: false,
    verified: true,
    avatar:
      'https://i.guim.co.uk/img/media/788dbbce44c1846fab9da460f64d23d02754a143/362_0_776_1626/master/776.jpg?width=300&quality=45&auto=format&fit=max&dpr=2&s=91c98c71c708b039e9fc3eed87177d6c',
    postsCount: 39807398,
    description,
  },
];

const categories = [
  {
    id: 'cat0',
    name: 'General',
    avatar:
      'https://thumbs.dreamstime.com/b/cartoon-illustration-army-general-cartoon-army-general-119601558.jpg',
  },
  {
    id: 'cat1',
    name: 'Travel',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/PilotwingsSymbol.svg/256px-PilotwingsSymbol.svg.png',
  },
  {
    id: 'cat2',
    name: 'Fun',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Oxygen480-emotes-face-smile-big.svg/256px-Oxygen480-emotes-face-smile-big.svg.png',
  },
  {
    id: 'cat3',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat4',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat5',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat6',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat7',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat8',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat9',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
  {
    id: 'cat10',
    name: 'Random',
    avatar: 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/game-die.png',
  },
];

const communityFeeds = communities.map(community => [
  {
    id: 'c1',
    author: community,
    text: 'Community post',
  },
]);

export const testNewsFeed = [
  {
    id: 1,
    author: communities[3],
    text: 'News feed post',
  },
  {
    id: 2,
    author: communities[2],
    text: 'News feed post',
  },
];

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

const communitiesAtom = atom({
  key: 'communities',
  default: communities,
});

const categoriesAtom = atom({
  key: 'categories',
  default: categories,
});

const myCommunityIdsAtom = atom({
  key: 'myCommunityIds',
  default: ['c4', 'c5', 'c6'],
});

export const getUser = userId => testUsers.find(user => user.userId === userId);

export const getCommunities = () => useRecoilValue(communitiesAtom);
export const getCommunity = communityId =>
  getCommunities().find(community => community.communityId === communityId);

export const getCategories = () => useRecoilValue(categoriesAtom);

export const getCategory = categoryId => getCategories().find(({ id }) => id === categoryId);

export const getMyCommunityIds = () => useRecoilValue(myCommunityIdsAtom);

const myCommunities = selector({
  key: 'myCommunities',
  get: ({ get }) => {
    const communities = get(communitiesAtom);
    const myCommunityIds = get(myCommunityIdsAtom);

    return myCommunityIds.map(id => communities.find(({ communityId }) => communityId === id));
  },
});

export const getMyCommunities = () => useRecoilValue(myCommunities);

const postsAtom = atom({ key: 'posts', default: posts });

const myNewsFeed = selector({
  key: 'myNewsFeed',
  get: ({ get }) => {
    const posts = get(postsAtom);
    const myCommunityIds = get(myCommunityIdsAtom);

    const myNewsSources = [...myCommunityIds, testUser.userId];

    return posts.filter(({ targetId }) => myNewsSources.includes(targetId));
  },
});

export const getNewsFeed = () => useRecoilValue(myNewsFeed);

export const usePostsMock = targetId => {
  const [posts, setPosts] = useRecoilState(postsAtom);

  const addPost = newPost => setPosts([newPost, ...posts]);
  const removePost = postId => setPosts(posts.filter(post => post.postId !== postId));

  const editPost = updatedPost =>
    setPosts(posts.map(post => (post.postId === updatedPost.postId ? updatedPost : post)));

  const fetchMorePosts = () => {
    setTimeout(() => {
      setPosts([...posts, {
        postId: v4(),
        targetId: 'u1',
        author: testUser,
        text: v4(),
      }]);
    }, 150);
  };

  const postsFeed = targetId
    ? posts.filter(community => community.targetId === targetId)
    : getNewsFeed();

  return { posts: postsFeed, addPost, removePost, editPost, fetchMorePosts };
};

export const useCommunitiesMock = () => {
  const [communities, setCommunities] = useRecoilState(communitiesAtom);
  const [myCommunities, setMyCommunities] = useRecoilState(myCommunityIdsAtom);

  const joinCommunity = id => setMyCommunities([id, ...myCommunities]);

  const leaveCommunity = id =>
    setMyCommunities(myCommunities.filter(communityId => communityId !== id));

  const addCommunity = community => {
    const communityId = `c${Date.now()}`;
    const newCommunity = {
      communityId,
      postsCount: 2357,
      description,
      ...community,
    };
    setCommunities([
      newCommunity,
      ...communities,
    ]);
    joinCommunity(communityId);

    return newCommunity;
  };

  const removeCommunity = communityId =>
    setCommunities(communities.filter(community => community.communityId !== communityId));

  const editCommunity = updatedCommunity =>
    setCommunities(
      communities.map(community =>
        community.communityId === updatedCommunity.communityId ? updatedCommunity : community,
      ),
    );

  const communitiesFeed = getCommunities();

  return {
    communities,
    joinCommunity,
    leaveCommunity,
    addCommunity,
    removeCommunity,
    editCommunity,
  };
};

export default RecoilRoot;
