import { NgModule } from '@angular/core';
import { EnvVariablesToken } from './environment.token';
import { variables } from './environment.generic';

declare const process: any; // Typescript compiler will complain without this

export function environmentFactory() {
  console.log(JSON.stringify(process.env.IONIC_ENV, undefined, 2));
  console.log(JSON.stringify(variables, undefined, 2));
  return variables;
}

@NgModule({
  providers: [
    {
      provide: EnvVariablesToken,
      // useFactory instead of useValue so we can easily add more logic as needed.
      useFactory: environmentFactory
    }
  ]
})
export class EnvironmentsModule {}