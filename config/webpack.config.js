const path = require('path');
const webpack = require('webpack');
const ionicWebpackFactory = require(process.env.IONIC_WEBPACK_FACTORY);

const appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR || '@ionic/app-scripts';
const rootDir = process.env.IONIC_ROOT_DIR;
const nodeEnv = process.env.NODE_ENV || 'development';
const ionicEnv = (nodeEnv == 'production') ? 'prod' : 'dev';

var config = require(path.join(appScriptsDir, 'config', 'webpack.config.js'));

const resolvePathToEnvModule = (nodeEnv) => {
  let curEnvPath;
  if(nodeEnv == 'production') {
    curEnvPath = path.join(rootDir, 'src/environments', 'environment.prod.js');
  } else {
    curEnvPath = path.join(rootDir, 'src/environments', 'environment.dev.js');
  }
  return curEnvPath;
}

const pathToEnvModule = resolvePathToEnvModule(nodeEnv);

/*
  const gerCurEnv = (nodeEnv) => {
    let curEnvPath = resolvePathToEnvModule(nodeEnv);
    return require(curEnvPath);
  }
  var envVars = gerCurEnv(nodeEnv);
  
  envVars.IONIC_ENV = process.env.IONIC_ENV;
  
  process.env.API_URL = envVars.API_URL;
  process.env.FB_APP_ID = envVars.FB_APP_ID;
  process.env.GGL_CLIENT_ID = envVars.GGL_CLIENT_ID;
  process.env.GGL_API_KEY =envVars.GGL_API_KEY;
*/
  
module.exports = function () {
  config[process.env.IONIC_ENV].plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  );
  config[process.env.IONIC_ENV].resolve.alias = {
      "@environment": pathToEnvModule
  };
  config[process.env.IONIC_ENV].resolve.extensions = ['.ts', '.js', '.json'];
  //console.log(config[process.env.IONIC_ENV].resolve); 
  return config;
}