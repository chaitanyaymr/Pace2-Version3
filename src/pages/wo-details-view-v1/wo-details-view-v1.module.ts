import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WoDetailsViewV1Page } from './wo-details-view-v1';

@NgModule({
  declarations: [
    WoDetailsViewV1Page,
  ],
  imports: [
    IonicPageModule.forChild(WoDetailsViewV1Page),
  ],
})
export class WoDetailsViewV1PageModule {}
