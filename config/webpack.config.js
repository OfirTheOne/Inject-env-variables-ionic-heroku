


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
    curEnvPath = path.join(rootDir, 'src/environments/environment-values', 'environment.prod.js');
  } else {
    curEnvPath = path.join(rootDir, 'src/environments/environment-values', 'environment.dev.js');
  }
  return curEnvPath;
}

const gerCurEnv = (nodeEnv) => {
  let curEnvPath = resolvePathToEnvModule(nodeEnv);
  return require(curEnvPath);
}

var pathToEnvModule = resolvePathToEnvModule(nodeEnv);

var envVars = gerCurEnv(nodeEnv);
envVars.IONIC_ENV = process.env.IONIC_ENV;
console.log(pathToEnvModule);
console.log(JSON.stringify(envVars, undefined, 2));

process.env.API_URL = envVars.API_URL;
process.env.FB_APP_ID = envVars.FB_APP_ID;
process.env.GGL_CLIENT_ID = envVars.GGL_CLIENT_ID;
process.env.GGL_API_KEY =envVars.GGL_API_KEY;

console.log(JSON.stringify(process.env, undefined, 2));
    
module.exports = (_env) => { 

config[ionicEnv] = {
  entry: process.env.IONIC_APP_ENTRY_POINT,
  output: {
    path: '{{BUILD}}',
    publicPath: 'build/',
    pathinfo: true, // show module paths in the bundle, handy for debugging
    filename: process.env.IONIC_OUTPUT_JS_FILE_NAME,
    devtoolModuleFilenameTemplate: ionicWebpackFactory.getSourceMapperFunction(),
  },
  devtool: process.env.IONIC_SOURCE_MAP_TYPE,

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [ path.join(__dirname, 'www', 'app'), path.resolve('node_modules')]
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.ts$/,
        loader: process.env.IONIC_WEBPACK_LOADER
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      myEnv: pathToEnvModule,
    }),
    /*
    ionicWebpackFactory.getIonicEnvironmentPlugin(),
    // Get access to IONIC_ENV, but also get access to NODE_ENV *and* default it to 'development'
    new webpack.DefinePlugin({
      'myEnv.IONIC_ENV' : JSON.stringify(envVars.IONIC_ENV),
      'myEnv.API_URL' : JSON.stringify(envVars.API_URL),
      'myEnv.FB_APP_ID' : JSON.stringify(envVars.FB_APP_ID),
      'myEnv.GGL_CLIENT_ID' : JSON.stringify(envVars.GGL_CLIENT_ID),
      'myEnv.GGL_API_KEY' : JSON.stringify(envVars.GGL_API_KEY) 
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
    */
  ],



  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};


// new webpack.EnvironmentPlugin({
//   'process.env.API_URL' : JSON.stringify(envVars.API_URL),
//   'process.env.FB_APP_ID' : JSON.stringify(envVars.FB_APP_ID),
//   'process.env.GGL_CLIENT_ID' : JSON.stringify(envVars.GGL_CLIENT_ID),
//   'process.env.GGL_API_KEY' : JSON.stringify(envVars.GGL_API_KEY)
// })

console.log(JSON.stringify(config[ionicEnv], undefined, 2));




  console.log('from module.exports : ', _env);
  return config; 
};
