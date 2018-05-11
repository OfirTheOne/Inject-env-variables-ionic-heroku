// declare const myEnv: any;
//console.log('environment.generic.ts : myEnv = ', myEnv);

declare const IONIC_ENV: string;
declare const API_URL: string;
declare const FB_APP_ID : string;
declare const GGL_CLIENT_ID : string;
declare const GGL_API_KEY : string; 

export const variables = {
    IONIC_ENV,
    API_URL,
    GGL_API_KEY,
    FB_APP_ID,
    GGL_CLIENT_ID
};