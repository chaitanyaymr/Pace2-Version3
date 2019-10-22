import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoDetailsViewPage } from './wo-details-view';

@NgModule({
  declarations: [
    WoDetailsViewPage,
  ],
  imports: [
    IonicPageModule.forChild(WoDetailsViewPage),
  ],
})
export class WoDetailsViewPageModule {}
