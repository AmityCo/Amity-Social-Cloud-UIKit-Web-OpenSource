import { forwardRef, KeyboardEvent } from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useString } from '~/v4/core/localization';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { TextContent } from '~/v4/social/components/PostContent/TextContent/TextContent';
import {
  resolveCardVariant,
  getCardAccessibleName,
} from '~/v4/social/features/content-widget/utils';
import { useMaxBodyLines } from '~/v4/social/features/content-widget/hooks';
import type { ContentWidgetLayout } from '~/v4/social/features/content-widget/types';
import {
  CARD_MEDIA_TEXT_MAX_LINES,
  CARD_LINK_TEXT_MAX_LINES,
  CARD_POLL_TEXT_MAX_LINES,
} from '~/v4/social/features/content-widget/constants';
import { Header } from './components/Header';
import { Media } from './components/Media';
import { EngagementBar } from './components/EngagementBar';
import { Poll } from './components/Poll';
import styles from './PostCard.module.css';

export type PostCardProps = {
  pageId?: string;
  post: Amity.Post;
  layout: ContentWidgetLayout;
  onClick?: () => void;
  tabIndex?: number;
};

export const PostCard = forwardRef<HTMLDivElement, PostCardProps>(function PostCard(
  { pageId = '*', post, layout, onClick, tabIndex = 0 },
  ref,
) {
  const componentId = COMPONENT_ID.CONTENT_WIDGET_POST_CARD_COMPONENT;

  const { themeStyles, accessibilityId } = useAmityComponent({ pageId, componentId });

  const variant = resolveCardVariant(post);

  const isPoll = variant === 'poll';
  const isMedia = variant === 'image' || variant === 'video';
  const isLink = variant === 'link';
  const isText = !isPoll && !isMedia && !isLink;

  const { containerRef: textRef, lines: textLines } = useMaxBodyLines(isText, layout);

  const data = (post.data as { title?: string; text?: string } | undefined) ?? {};

  const hasCaption = !!data.title || !!data.text;

  const photoWord = useString('amity_social_button_post_composer_image_button');
  const videoWord = useString('amity_social_button_post_composer_video_button');
  const clipWord = useString('amity_social_button_clip');
  const pollWord = useString('amity_social_button_poll');

  const ariaLabel = getCardAccessibleName(post, variant, {
    photo: photoWord,
    video: videoWord,
    clip: clipWord,
    poll: pollWord,
  });

  const handleClick = () => onClick?.();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  const renderText = (maxLines: number, titleClassName: string, title = data.title ?? '') => (
    <TextContent
      pageId={pageId}
      componentId={componentId}
      post={post}
      title={title}
      text={data.text ?? ''}
      mentioned={post?.metadata?.mentioned}
      mentionees={post?.mentionees}
      hashtagged={post?.metadata?.hashtags}
      hashtags={post?.hashtags}
      type="widget"
      maxLines={maxLines}
      titleClassName={titleClassName}
    />
  );

  return (
    <div
      ref={ref}
      className={styles.card}
      style={themeStyles}
      data-testid={accessibilityId}
      data-layout={layout}
      role="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <Header pageId={pageId} componentId={componentId} post={post} />

      <div className={styles.card__middle}>
        {isPoll ? (
          <>
            {hasCaption && (
              <div className={styles.card__textCompact}>
                {renderText(CARD_POLL_TEXT_MAX_LINES, styles.card__title1)}
              </div>
            )}
            <div className={styles.card__block}>
              <Poll post={post} />
            </div>
          </>
        ) : isMedia ? (
          <>
            {hasCaption && (
              <div className={styles.card__textHug}>
                {renderText(CARD_MEDIA_TEXT_MAX_LINES, styles.card__title1)}
              </div>
            )}
            <div className={styles.card__mediaFlex}>
              <Media post={post} />
            </div>
          </>
        ) : isLink ? (
          <div className={styles.card__textFull}>
            {renderText(CARD_LINK_TEXT_MAX_LINES, styles.card__title1)}
          </div>
        ) : (
          <div className={styles.card__textFull}>
            {data.title && (
              <Typography.TitleBold as="p" className={styles.card__title4}>
                {data.title}
              </Typography.TitleBold>
            )}
            <div ref={textRef} className={styles.card__bodyFill}>
              {renderText(textLines, styles.card__title4, '')}
            </div>
          </div>
        )}
      </div>

      <EngagementBar post={post} />
    </div>
  );
});
