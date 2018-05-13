## The problem we targeting :
Having a web app developed in Ionic 3 framework and [Deploying to heroku with Git](https://devcenter.heroku.com/articles/git).<br>
I must manage at least two environments, prod(uction) and dev(elopment), and another important requirement is that no sensitive data (e.g API_URL, CLIENT_KEY) will publicly sit in the app's git repo.
<br>
* first, manage two envaierments, prod and dev, with different behaviors - in this case *inject different envaierment variables values in dev mode and prod mode*. <br>
* second, inject envaierment variables - conataininig *sensitive values* - on the heroku server *without it sitting in the repo*. 

we dealing with multiple frameworks in this process - Angular-Ionic, Webpack and Heroku.
<br><br><br>

## The idea to solve this : 
We got our config data on a `dev.json` and a `prod.json` (one for each env, can be more than two). 
<br>
and wherever we'll need to use our environment object we'll import it from some environment module, 
using webpack we will make the the environment object to be imported from `dev.json` on dev mode, and from `prod.json` on prod mode.
<br>
On the `tsconfig.json` file in the "compilerOptions" entry we can set an alias names for dir paths on our project, and webpack make it possible for us to change the path that the alias is named from in the build process. 
<br> 
What we'll do is in the the webpack config (that will used for the bundling of the project) we will pick the env mode we are on now (dev/prod) and set the alias to a dir path accordingly, e.g : dev -> '...env/dev.json', prod -> '...env/prod.json']. 
<br>
That's solves the behavior differences on each environment, but another thing is to not have the environment data sitting publicly on the git repo (and in what we discribed so far, the dev file not on git but the prod file is).
<br> 
Heroku giving us the option to define [config vars](https://devcenter.heroku.com/articles/config-vars) on our app setting page. the values will be saved securely on heroku, and will be added to `process.env` object, for us to use in our app code. 
<br>
Using `process.env` will bring us to define another config plugin in the webpack config file .
<br><br><br>

## The solution :

#### Handle the low level configuretion : 

**1.** in your package.json make sure that "@ionic/app-scripts", "typescript" in the "dependencies" enrty <br>

    "dependencies" : {
        ... 
        "@ionic/app-scripts": "3.1.9", 
        "typescript": "~2.6.2" 
    } 
<br><br>

**2.** to the "scripts" entry add the following : <br>

    scripts : {
        ...
        "postinstall": "ionic-app-scripts build --prod webpack --display-error-details --config ./config/webpack.config.js",
        "ionic:build": "ionic-app-scripts build --prod"
    }

with `--prod` we set the prod flag up during the build on the server, and `webpack` configure the way that webpack will bundle our app. <br>
more on this setup [here](https://github.com/ionic-team/ionic-app-scripts#command-line-flags) & [here](https://docs.npmjs.com/misc/scripts#description).<br>
<br><br>

**3.** add an entry called `config` to your package.json as in the following : <br>

    "config" : {
        "ionic_webpack": "./config/webpack.config.js"
    }

telling ionic to override the caustom webpack config with our webpack config. <br>
<br><br>

**4.** to the tsconfig.json add the following to the `compilerOptions` entry : <br>

    "compilerOptions":  {
        ...
        "baseUrl":  "./src",
        "paths": {
            "@environment": ["environments/environment.prod"]
        }
    }
    
Here we defining an alias named `@environment` to the path "environments/environment.prod" relative to "./src". <br>
now the line `import * as env from '@environment'` will import what exported from ./src/environments/environment.prod. <br>
(that is the value that we'll change on each environment)<br>
<br><br><br>

#### Handle the webpack configuretion :
On the root of your app (same level as node_modules) create a folder name `config`, and in it create a file name `webpack.config.js` .
<br>
The code on this file will be using [Ionic Environment Variables](https://github.com/ionic-team/ionic-app-scripts#ionic-environment-variables), and mainlly [webpack](https://webpack.js.org) code.
    
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
      // set the path of the alias @environment to the cur env. 
      config[ionicEnv].resolve.alias = {
          "@environment": pathToEnvModule
      };
      config[ionicEnv].resolve.extensions = ['.ts', '.js', '.json'];
      
      return config;
    }
<br><br><br>

#### Handle the environment service implementation :
Encapsulating the environment variable in a service is the best practice in this case. <br>
Where you need to use the env object inject the service like any other service ..

    import * as _env from '@environment';  //  <-- generically import the env object according to the current environment
    import { Injectable } from "@angular/core";
    
    @Injectable()
    export class EnvironmentService {
    
        private env: {[key: string]: string | undefined};
        
        constructor() {
            console.log(`${_env}`);
            this.env = Object.freeze(_env); // <-- making env object to be immutable
        }
    
        get(keyName : string): string | undefined {
            console.log(`get(${keyName})`);
            if(this.env.hasOwnProperty(keyName)) {
                return this.env[keyName]
            } else {
                console.log(`env has no property name ${keyName}.`);
            }
        }
    
        getEnv(): {[key: string]: string | undefined} {
            console.log(`getEnv()`);
            return this.env;
        }
    }

<br><br><br><br>

# res: 
* https://devcenter.heroku.com/articles/nodejs-support
* https://github.com/ionic-team/ionic-app-scripts
* https://github.com/gshigeto/ionic-environment-variables
* https://webpack.js.org/plugins/define-plugin/
* https://stackoverflow.com/questions/41473262/deploying-ionic2-on-heroku
* https://stackoverflow.com/questions/36223070/how-to-deploy-node-that-uses-webpack-to-heroku
* https://github.com/ionic-team/ionic-app-scripts/blob/master/CHANGELOG.md#300-2017-09-28
* https://stackoverflow.com/questions/43598311/component-is-part-of-the-declaration-of-2-modules/47394702
* https://forum.ionicframework.com/t/howto-webpack/47694
* https://www.williamghelfi.com/blog/2017/06/22/ionic-environments-webpack/
* https://blog.grossman.io/writing-es6-ionic-code-with-webpack/
* http://blog.lssinc.com/2017/04/24/ionic-environment-variables-the-best-way/
** http://geeklearning.io/our-project-template-to-build-awesome-ionic-apps-using-webpack-and-typescript/
* https://angular.io/guide/dependency-injection-pattern
** https://codecraft.tv/courses/angular/dependency-injection-and-providers/tokens/
* https://github.com/roblouie/ionic2-environment-variables/blob/master/webpack.config.js
* https://artyomsokolov.com/how-to-use-different-environment-variables-for-production-and-development-with-ionic-3/
