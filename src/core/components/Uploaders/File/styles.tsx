import React, { ReactNode } from 'react';
import styled from 'styled-components';

import Button from '~/core/components/Button';

import Remove from '~/icons/Remove';
import Icon from '~/icons/files';
import ExclamationCircle from '~/icons/ExclamationCircle';
import { FormattedMessage } from 'react-intl';

type ButtonProps = Omit<React.ComponentProps<typeof Button>, 'variant' | 'children'>;

export const FileContainer = styled.a`
  display: block;
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
  overflow: hidden;
  text-decoration: none;
`;

export const Content = styled.div`
  position: relative;
  display: grid;
  grid-template-areas: 'icon name size remove';
  grid-template-columns: minmax(min-content, 2em) auto max-content min-content;
  grid-template-rows: 2.5em;
  grid-gap: 0.5em;
  padding: 0.5em;
  align-items: center;
`;

export const ImgPreview = styled.img.attrs({ loading: 'lazy' })`
  grid-area: icon;
  width: 2.5em;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  border-radius: 4px;
`;

export const FileIcon = styled(Icon)`
  grid-area: icon;
`;

export const CircleIcon = styled(ExclamationCircle).attrs<{ icon?: ReactNode }>({
  width: 14,
  height: 14,
})`
  fill: ${({ theme }) => theme.palette.alert.main};
  z-index: 2;
`;

export const RetryButton = (props: ButtonProps) => (
  <Button {...props} variant="secondary">
    <>
      <CircleIcon /> <FormattedMessage id="file.reUpload" />
    </>
  </Button>
);

export const FileName = styled.div`
  grid-area: name;
  padding: 0 0.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.typography.bodyBold}
`;

export const FileSize = styled.div`
  grid-area: size;
  ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const RemoveIcon = styled(Remove)`
  grid-area: remove;
  z-index: 2;
`;

export const RemoveButton = (props: ButtonProps) => (
  <Button {...props} variant="secondary">
    <RemoveIcon width={14} height={14} />
  </Button>
);

export const ButtonContainer = styled.div`
  display: flex;
`;
