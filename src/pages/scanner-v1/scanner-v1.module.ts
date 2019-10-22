import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScannerV1Page } from './scanner-v1';

@NgModule({
  declarations: [
    ScannerV1Page,
  ],
  imports: [
    IonicPageModule.forChild(ScannerV1Page),
  ],
})
export class ScannerV1PageModule {}
