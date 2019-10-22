import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScannerV1Page } from './scanner-v1';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    ScannerV1Page,
  ],
  imports: [
    IonicPageModule.forChild(ScannerV1Page),pace2headerModule
  ],
  providers:[
    BarcodeScanner
  ]
})
export class ScannerV1PageModule {}
