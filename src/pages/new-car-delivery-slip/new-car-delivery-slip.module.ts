import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCarDeliverySlipPage } from './new-car-delivery-slip';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DatePicker } from '@ionic-native/date-picker';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';

@NgModule({
  declarations: [
    NewCarDeliverySlipPage,
  ],
  imports: [
    IonicPageModule.forChild(NewCarDeliverySlipPage),
    pace2headerModule
  ],
  providers:[
    BarcodeScanner,
    DatePicker
  ]
})
export class NewCarDeliverySlipPageModule {}
