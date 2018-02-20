import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Pro } from '@ionic/pro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public deployChannel = '';
  public isBeta = false;
  public downloadProgress = 0;

  constructor(public navCtrl: NavController) {
    this.checkChannel();
  }

  async checkChannel() {

    try {
      const res = await Pro.deploy.info();
      this.deployChannel = res.channel;
      this.isBeta = (this.deployChannel === 'Beta');
    } catch (err) {
      Pro.monitoring.exception(err);
    }

  }

  async toggleBeta() {

    const config = {
      channel: (this.isBeta ? 'Beta' : 'Production')
    }

    try {

      await Pro.deploy.init(config);
      await this.checkChannel();
      await this.performAutomaticUpdate();

    } catch (err) {
      Pro.monitoring.exception(err);
    }

  }

  async performAutomaticUpdate() {

    try {

      const resp = await Pro.deploy.checkAndApply(true, function(progress){
        this.downloadProgress = progress;
      })

      if (resp.update){
        // We got an update and we're redirecting
      }else{
        // No update was found
      }

    } catch (err) {
      Pro.monitoring.exception(err);
    }

  }

}
