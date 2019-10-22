import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWorkorderV1Page } from './create-workorder-v1';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from '@ionic-native/camera';
import { DatePicker } from '@ionic-native/date-picker';
import { Device } from '@ionic-native/device';

@NgModule({
  declarations: [
    CreateWorkorderV1Page,
  ],
  imports: [
    IonicPageModule.forChild(CreateWorkorderV1Page),pace2headerModule
  ],
  providers:[
    BarcodeScanner,Camera,DatePicker,Device
  ]
})
export class CreateWorkorderV1PageModule {}
