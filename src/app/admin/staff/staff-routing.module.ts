import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllStaffComponent } from "./all-staff/all-staff.component";

const routes: Routes = [
  {
    path: "all-staff",
    component: AllStaffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
