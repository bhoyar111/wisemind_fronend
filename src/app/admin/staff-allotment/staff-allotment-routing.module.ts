import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllStaffAllotmentComponent } from './all-staff-allotment/all-staff-allotment.component'

const routes: Routes = [
  {
    path:'all-staff-allotment',
    component: AllStaffAllotmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffAllotmentRoutingModule { }
