// Learn more: https://docs.expo.dev/guides/monorepos/
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// The web app (React 18) and this app (React 19, pinned to react-native's renderer)
// live in one npm workspace, so more than one copy of `react` exists in node_modules.
// Force every `react` import — including ones from hoisted packages like react-native
// at the repo root — to resolve to this app's copy.
const appPackageJson = path.join(__dirname, 'package.json')
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    return context.resolveRequest({ ...context, originModulePath: appPackageJson }, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
