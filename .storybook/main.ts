import path from 'path';
import { readdirSync } from 'fs';
import type { InlineConfig, Plugin } from 'vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-toolbars',
    '@storybook/addon-a11y',
  ],
  framework: '@storybook/react-vite',
  staticDirs: ['../static'],
  viteFinal: async (config) => {
    config.plugins?.push(
      assetPlugin(config, {
        markup: `[ICONS]`,
        exclude: [/.*stories.*/],
        assetDir: 'src/v4/icons',
        storyFileName: 'icons.stories.tsx',
      }),
    );
    return config;
  },
};

export default config;

const assetPlugin: (
  config: InlineConfig,
  options: {
    assetDir: string;
    storyFileName: string;
    exclude?: Array<RegExp>;
    markup: string | RegExp;
  },
) => Plugin = (config, { storyFileName, assetDir, exclude, markup }) => {
  return {
    enforce: 'pre',
    name: 'vite-plugin-v4-icons',
    transform(code, id) {
      const rootDir = config.root!;

      if (id.includes(storyFileName)) {
        let icons = '',
          imports = '';
        readdirSync(path.join(rootDir, assetDir)).forEach((file) => {
          if (file.match(/.*\.(tsx)/) && exclude?.every((ex) => !file.match(ex))) {
            const fileName = file.replace(/.tsx/, '');
            const source = {
              relativePath: path.join(assetDir.replace(/.*src\//, ''), fileName),
              path: path.join(rootDir, assetDir, file),
            };

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const exportedAssets = require(source.path!);
            const entries = Object.entries(exportedAssets);

            entries.map(([key, _]) => {
              const componentName = key === 'default' ? fileName : key;
              imports +=
                key == 'default'
                  ? `import ${fileName} from "src/${source?.relativePath}";\n`
                  : `import {${key}} from "src/${source?.relativePath}";\n`;
              icons += `
                  <button 
                    key="${key}"
                    data-name="${componentName}" 
                  >
                    <${componentName} width='25' height='25' />
                    <div>
                      <p>${componentName}</p>
                      <p>${source.relativePath.replace('/src', '')}</p>
                    </div>
                  </button>
            `;
            });
          }
        });

        code = imports + code.replace(markup, icons);
      }
      return code;
    },
  };
};
