import React from 'react';
import File from '~/core/components/Uploaders/File';

interface FileContentProps {
  fileId: string;
}

const FileContent = ({ fileId }: FileContentProps) => <File fileId={fileId} />;

export default FileContent;
