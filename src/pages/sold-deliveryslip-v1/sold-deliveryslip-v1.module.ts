import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoldDeliveryslipV1Page } from './sold-deliveryslip-v1';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Device } from '@ionic-native/device';
import { DatePicker } from '@ionic-native/date-picker';

@NgModule({
  declarations: [
    SoldDeliveryslipV1Page,
  ],
  imports: [
    IonicPageModule.forChild(SoldDeliveryslipV1Page),pace2headerModule
  ],
  providers:[
    BarcodeScanner,  
    Device,
    DatePicker
  ]
})
export class SoldDeliveryslipV1PageModule {}
