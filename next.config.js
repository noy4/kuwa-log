const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/kuwa-log' : ''

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath,
  env: {
    basePath,
  },
}
