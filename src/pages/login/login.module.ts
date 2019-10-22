import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { Device } from '@ionic-native/device';


@NgModule({
  declarations: [
    LoginPage,
    
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  providers:[
    Device
    
  ]
})
export class LoginPageModule {}
