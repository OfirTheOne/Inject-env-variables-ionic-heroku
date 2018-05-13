const path = require('path');
const webpack = require('webpack');
const ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);

const appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR || '@ionic/app-scripts';
const rootDir = process.env.IONIC_ROOT_DIR;

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


module.exports = function () {
  var pathToEnvModule = resolvePathToEnvModule(process.env.IONIC_ENV);
  console.log(`NODE_ENV : ${process.env.NODE_ENV}`)
  console.log(`process.env.IONIC_ENV : ${process.env.IONIC_ENV}`);
  console.log(`pathToEnvModule : ${pathToEnvModule}`);
  // set process.env as a global variable.
  config[process.env.IONIC_ENV].plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  );
  // set the pat of the alias @environment to the cur env. 
  config[process.env.IONIC_ENV].resolve.alias = {
      "@environment": pathToEnvModule
  };
  config[process.env.IONIC_ENV].resolve.extensions = ['.ts', '.js', '.json'];
  
  return config;
}