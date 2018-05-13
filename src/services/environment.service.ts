import * as _env from '@environment';
import { Injectable } from "@angular/core";

@Injectable()
export class EnvironmentService {

    private env: {[key: string]: string | undefined};
    
    constructor() {
        console.log(`${_env}`);
        this.env = Object.freeze(_env); // making env object to be imutiable
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