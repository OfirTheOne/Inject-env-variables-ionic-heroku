const path = require('path');
const webpack = require('webpack');
const ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);

const appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR || '@ionic/app-scripts';
const rootDir = process.env.IONIC_ROOT_DIR;
const ionicEnv = process.env.IONIC_ENV || 'dev';

var config = require(path.join(appScriptsDir, 'config', 'webpack.config.js'));

const resolvePathToEnvModule = (ionicEnv) => {
  let curEnvPath;
  if(ionicEnv == 'prod') {
    curEnvPath = path.join(rootDir, 'src/environments', 'environment.prod.js');
  } else {
    curEnvPath = path.join(rootDir, 'src/environments', 'environment.dev.js');
  }
  return curEnvPath;
}

const pathToEnvModule = resolvePathToEnvModule(ionicEnv);

module.exports = function () {
  // set process.env as a global variable.
  config[ionicEnv].plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  );
  // set the pat of the alias @environment to the cur env. 
  config[ionicEnv].resolve.alias = {
      "@environment": pathToEnvModule
  };
  config[ionicEnv].resolve.extensions = ['.ts', '.js', '.json'];
  
  return config;
}