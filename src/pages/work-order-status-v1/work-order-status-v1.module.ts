import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderStatusV1Page } from './work-order-status-v1';

@NgModule({
  declarations: [
    WorkOrderStatusV1Page,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderStatusV1Page),
  ],
})
export class WorkOrderStatusV1PageModule {}
