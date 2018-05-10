declare const myEnv: any;
console.log('environment.generic.ts : myEnv = ', myEnv);
export const variables = {
    IONIC_ENV: myEnv.IONIC_ENV,
    API_URL: myEnv.API_URL,
    GGL_API_KEY: myEnv.GGL_API_KEY,
    FB_APP_ID: myEnv.FB_APP_ID,
    GGL_CLIENT_ID: myEnv.GGL_CLIENT_ID
};