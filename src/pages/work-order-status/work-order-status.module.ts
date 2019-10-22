import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderStatusPage } from './work-order-status';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';

@NgModule({
  declarations: [
    WorkOrderStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderStatusPage),
    pace2headerModule
  ],
})
export class WorkOrderStatusPageModule {}
