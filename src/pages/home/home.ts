import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EnvironmentService } from '../../services/environment.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private environment: EnvironmentService) {}

  ionViewDidLoad() {
    console.log(this.environment.getEnv());
  }
}
