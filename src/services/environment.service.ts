import * as _env from '@environment';
import { Injectable } from "@angular/core";

@Injectable()
export class EnvironmentService {

    private readonly PRODUCTION_MODE_NAMESPACE = 'prod';
    private readonly DEVELOPMENT_MODE_NAMESPACE = 'dev';

    private env: {[key: string]: string | undefined};
    
    constructor() {
        console.log(`${_env}`);
        this.env = Object.freeze(_env); // making env object to be imutiable
        console.log(this.get('CUR_ENV'));
        
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

    isProd(): boolean {
        return this.env['CUR_ENV'] == this.PRODUCTION_MODE_NAMESPACE; 
    }

    isDev(): boolean {
        return this.env['CUR_ENV'] == this.DEVELOPMENT_MODE_NAMESPACE; 
    }
}