import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { EnvVariablesToken } from '../../environments/environment.token';
import * as ENV  from '@environment';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController/*, @Inject(EnvVariablesToken) public envVariables */) {

  }

  ionViewDidLoad() {
    console.log(ENV);
    // console.log(this.envVariables.API_URL);

  }
}
