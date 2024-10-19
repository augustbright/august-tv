/* eslint-disable @typescript-eslint/no-require-imports */
//@ts-check
const { rawEnv } = require('@august-tv/env');

module.exports = {
  env: rawEnv,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com'
      }
    ]
  }
};
