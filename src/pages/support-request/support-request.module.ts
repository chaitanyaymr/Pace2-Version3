import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportRequestPage } from './support-request';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
@NgModule({
  declarations: [
    SupportRequestPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportRequestPage), pace2headerModule
  ],
})
export class SupportRequestPageModule {}
