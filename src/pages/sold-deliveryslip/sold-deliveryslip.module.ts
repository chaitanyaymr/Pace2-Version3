import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoldDeliveryslipPage } from './sold-deliveryslip';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Device } from '@ionic-native/device';
import { DatePicker } from '@ionic-native/date-picker';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';

@NgModule({
  declarations: [
    SoldDeliveryslipPage,
  ],
  imports: [
    IonicPageModule.forChild(SoldDeliveryslipPage),
    pace2headerModule
  ],
  providers:[
    BarcodeScanner,  
    Device,
    DatePicker
  ]
})
export class SoldDeliveryslipPageModule {}
