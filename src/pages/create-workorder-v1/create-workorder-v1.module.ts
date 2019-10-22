import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWorkorderV1Page } from './create-workorder-v1';

@NgModule({
  declarations: [
    CreateWorkorderV1Page,
  ],
  imports: [
    IonicPageModule.forChild(CreateWorkorderV1Page),
  ],
})
export class CreateWorkorderV1PageModule {}
