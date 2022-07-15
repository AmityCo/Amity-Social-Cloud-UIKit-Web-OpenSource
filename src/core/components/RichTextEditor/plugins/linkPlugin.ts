import {
  createPluginFactory,
  isUrl as isUrlProtocol,
  onKeyDownLink,
  LinkPlugin,
  withLink,
  ELEMENT_LINK,
} from '@udecode/plate';

/**
 * Enables support for hyperlinks.
 */
export const createLinkPlugin = createPluginFactory<LinkPlugin>({
  key: ELEMENT_LINK,
  isElement: true,
  isInline: true,
  handlers: {
    onKeyDown: onKeyDownLink,
  },
  withOverrides: withLink,
  options: {
    isUrl: isUrlProtocol,
    rangeBeforeOptions: {
      matchString: ' ',
      skipInvalid: true,
      afterMatch: true,
    },
    // hotkey: 'mod+k',
  },
  then: (editor, { type }) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: 'A',
        },
      ],
      getNode: (el) => ({
        type,
        url: el.getAttribute('href'),
      }),
    },
  }),
});
