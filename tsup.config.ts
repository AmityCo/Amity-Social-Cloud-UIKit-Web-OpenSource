import { defineConfig } from 'tsup';
import { replace } from 'esbuild-plugin-replace';
import pkg from './package.json';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: options.sourcemap,
  // Avoid esbuild's CSS-module identifier minification. It can emit global
  // selectors such as `.md`, which collides with Ionic's Material Design mode
  // class in the mobile app.
  minify: false,
  minifyIdentifiers: false,
  minifySyntax: options.minify,
  minifyWhitespace: options.minify,
  clean: true,
  splitting: true,
  treeshake: true,
  metafile: true,
  legacyOutput: true,
  esbuildPlugins: [
    replace({
      include: /.(ts|js|jsx|tsx)$/,
      __TEST__: 'false',
      __VERSION__: `'${pkg.version}'`,
      __DEV__:
        '(typeof process !== "undefined" && process.env && process.env.NODE_ENV ? (process.env.NODE_ENV !== "production") : false)',
    }),
  ],
  esbuildOptions(buildOptions) {
    buildOptions.minify = false;
    buildOptions.minifyIdentifiers = false;
    buildOptions.minifySyntax = options.minify;
    buildOptions.minifyWhitespace = options.minify;
  },
  loader: {
    '.css': 'local-css',
  },
}));
