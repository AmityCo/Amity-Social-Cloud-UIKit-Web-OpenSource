import React from 'react';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { validateUrl } from '~/v4/helpers/utils';

export const LinkPlugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />;
