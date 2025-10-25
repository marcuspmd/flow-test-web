import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginStyledComponents } from '@rsbuild/plugin-styled-components';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginStyledComponents(),
    pluginSass(),
    pluginTypeCheck({
      enable: true,
    }),
    pluginBabel({
      include: /\.(?:ts|tsx|js|jsx)$/,
    }),
  ],
  source: {
    entry: {
      index: './src/index.tsx',
    },
    exclude: ['**/*.test.*', '**/*.spec.*'],
  },
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@pages': './src/pages',
      '@hooks': './src/hooks',
      '@providers': './src/providers',
      '@utils': './src/utils',
      '@styles': './src/styles',
      '@themes': './src/themes',
      '@types': './src/types',
    },
  },
  html: {
    title: 'Flow Test - API Testing Tool',
  },
  output: {
    cleanDistPath: true,
    distPath: {
      root: 'dist',
    },
  },
  dev: {
    hmr: true,
    liveReload: true,
  },
  tools: {
    rspack: {
      module: {
        parser: {
          javascript: {
            dynamicImportMode: 'eager',
          },
        },
      },
    },
  },
});
