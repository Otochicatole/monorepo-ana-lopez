import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        external: [
          '@strapi/design-system',
          '@strapi/icons',
          '@strapi/helper-plugin',
          '@strapi/strapi',
          'react',
          'react-dom',
          'react-router-dom',
          'styled-components',
        ],
      },
    },
  });
};

