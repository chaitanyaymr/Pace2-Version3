import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ScannerPage } from './scanner';
import{BarcodeScanner} from '@ionic-native/barcode-scanner';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
@NgModule({
  declarations: [
    ScannerPage,
  ],
  imports: [
    IonicPageModule.forChild(ScannerPage),
    pace2headerModule
  ],
  providers:[
    BarcodeScanner
  ]
})
export class ScannerPageModule {}
