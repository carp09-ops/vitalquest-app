const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'expo-sqlite') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'src/expo-sqlite.web.tsx'),
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
