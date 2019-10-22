import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCarDeliverySlipV1Page } from './new-car-delivery-slip-v1';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';

@NgModule({
  declarations: [
    NewCarDeliverySlipV1Page,
  ],
  imports: [
    IonicPageModule.forChild(NewCarDeliverySlipV1Page),pace2headerModule
  ],
  providers:[
    BarcodeScanner,
    DatePicker
  ]
})
export class NewCarDeliverySlipV1PageModule {}
