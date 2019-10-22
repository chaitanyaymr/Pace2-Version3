
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingServiceProvider {
  loading:any;
  constructor(public loadingCtrl:LoadingController) {
  }
  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `Pace 2 Loading...`,
    });
    this.loading.present();
  }
   hideloader()
   {
    this.loading.dismissAll();
   }

}
