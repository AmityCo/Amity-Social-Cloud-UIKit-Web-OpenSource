import {
  isUnsupportedMediaPost,
  withoutUnsupportedMediaPosts,
} from '~/v4/social/utils/isUnsupportedMediaPost';

const post = (id: string, structureType: string, childTypes: string[] = []) =>
  ({
    postId: id,
    dataType: 'text',
    structureType,
    childrenPosts: childTypes.map((t, i) => ({ postId: `${id}-c${i}`, dataType: t })),
  }) as unknown as Amity.Post;

describe('isUnsupportedMediaPost', () => {
  it.each([
    ['gif', 'gif', ['gif', 'gif']],
    ['audio', 'audio', ['audio']],
    ['file', 'file', ['file']],
    ['mixed', 'mixed', ['image', 'gif']],
  ])('hides a %s post', (_, structureType, children) => {
    expect(isUnsupportedMediaPost(post('p', structureType, children))).toBe(true);
  });

  it('hides a post with a GIF child even when its structureType is missing', () => {
    expect(isUnsupportedMediaPost(post('p', undefined as unknown as string, ['gif']))).toBe(true);
  });

  it.each([
    ['text', 'text', []],
    ['image', 'image', ['image', 'image']],
    ['video', 'video', ['video']],
    ['poll', 'text', ['poll']],
    ['livestream', 'text', ['room']],
    ['clip', 'text', ['clip']],
  ])('keeps a %s post', (_, structureType, children) => {
    expect(isUnsupportedMediaPost(post('p', structureType, children))).toBe(false);
  });

  it('keeps a missing post', () => {
    expect(isUnsupportedMediaPost(undefined)).toBe(false);
    expect(isUnsupportedMediaPost(null)).toBe(false);
  });
});

describe('withoutUnsupportedMediaPosts', () => {
  it('drops only the posts the UIKit cannot show', () => {
    const feed = [
      post('text-1', 'text'),
      post('gif-1', 'gif', ['gif']),
      post('image-1', 'image', ['image']),
      post('file-1', 'file', ['file']),
    ];

    expect(withoutUnsupportedMediaPosts(feed).map((p) => p.postId)).toEqual(['text-1', 'image-1']);
  });
});
