import filesize from 'filesize';

import FileIcon from '~/icons/files';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import useFile from '~/v4/core/hooks/useFile';

import styles from './FileContent.module.css';

type FileContentProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  posts: Amity.Post<'file'>[];
};

export const FileContent = ({
  posts,
  pageId = '*',
  componentId = '*',
  elementId = '*',
}: FileContentProps) => {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  const filePosts = (posts ?? []).filter((post) => post?.dataType === 'file');

  if (filePosts.length === 0) return null;

  return (
    <div style={themeStyles} className={styles.fileContent}>
      {filePosts.map((post) => (
        <FileItem
          key={post.postId}
          fileId={post.data?.fileId}
          pageId={pageId}
          componentId={componentId}
        />
      ))}
    </div>
  );
};

type FileItemProps = {
  fileId?: string;
  pageId?: string;
  componentId?: string;
};

function FileItem({ fileId, pageId = '*', componentId = '*' }: FileItemProps) {
  const file = useFile(fileId);

  if (!file) return null;

  const name = file.attributes?.name ?? 'File';
  const size = Number(file.attributes?.size);

  return (
    <a
      href={file.fileUrl}
      download
      className={styles.fileContent__item}
      data-testid={`${pageId}/${componentId}/post_file`}
    >
      <span className={styles.fileContent__icon}>
        {/* Reuse the composer's colored file-type icon set (PDF/Doc/Xls/…) */}
        <FileIcon file={{ name, type: file.attributes?.mimeType ?? '' }} />
      </span>
      <span className={styles.fileContent__info}>
        <Typography.BodyBold as="span" className={styles.fileContent__name}>
          {name}
        </Typography.BodyBold>
        {!Number.isNaN(size) && size > 0 && (
          <Typography.Caption className={styles.fileContent__size}>
            {filesize(size, { base: 2 })}
          </Typography.Caption>
        )}
      </span>
    </a>
  );
}
