import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnvVariablesToken } from '../../environments/environment.token';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, @Inject(EnvVariablesToken) public envVariables) {

  }

  ionViewDidLoad() {
    console.log(this.envVariables);
    console.log(this.envVariables.API_URL);

  }
}
