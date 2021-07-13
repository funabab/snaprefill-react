const webpack = require('webpack')
const package = require('./package.json')
const path = require('path')
const WebpackPWAManifest = require('webpack-pwa-manifest')

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('postcss-nesting'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          APP_VERSION: JSON.stringify(package.version),
        }),
        new webpack.DefinePlugin({
          APP_GITHUB: JSON.stringify(package.github),
        }),
        new WebpackPWAManifest({
          name: 'SnapRefill - OCR Recharge App',
          short_name: 'SnapRefill',
          description: package.description,
          theme_color: '#00CCCC',
          background_color: '#fff',
          inject: true,
          ios: true,
          icons: [
            {
              src: path.join(__dirname, 'public', 'icon.png'),
              sizes: [96, 128, 192, 256, 384, 512],
              ios: true,
            },
            {
              src: path.join(__dirname, 'public', 'icon.png'),
              size: '512x512',
              purpose: 'maskable',
            },
          ],
        }),
      ],
    },
  },
}
