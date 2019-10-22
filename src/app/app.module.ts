import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { PACE2 } from './app.component';
import { PaceEnvironment } from '../common/PaceEnvironment';
import { DatabaseProvider } from '../providers/database/database';
import {SQLite} from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { OdsServiceProvider } from '../providers/ods-service/ods-service';
import { Device } from '@ionic-native/device';
import { LoadingServiceProvider } from '../providers/loading-service/loading-service';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
import {FCM} from '@ionic-native/fcm';

@NgModule({
  declarations: [
    PACE2,
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(PACE2)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    PACE2,
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PaceEnvironment,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,SQLite,
    OdsServiceProvider,
    Device,
    LoadingServiceProvider,
    Network,NetworkInterface,
    FCM
  ]
})
export class AppModule {}
