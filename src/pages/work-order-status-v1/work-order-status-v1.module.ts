import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderStatusV1Page } from './work-order-status-v1';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';

@NgModule({
  declarations: [
    WorkOrderStatusV1Page,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderStatusV1Page),pace2headerModule
  ],
})
export class WorkOrderStatusV1PageModule {}
