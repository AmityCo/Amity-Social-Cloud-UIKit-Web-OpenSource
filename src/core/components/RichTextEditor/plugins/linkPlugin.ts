import {
  createPluginFactory,
  isUrl as isUrlProtocol,
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
  props: ({ element }) => ({ href: element?.url, target: element?.target }),
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
        link: el.getAttribute('href'),
        target: el.getAttribute('target') || '_blank',
      }),
    },
  }),
});
