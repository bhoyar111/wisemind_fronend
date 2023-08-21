import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AllMarkAllotmentComponent } from "./all-mark-allotment/all-mark-allotment.component";

const routes: Routes = [
  {
    path: "all-mark-allotment",
    component: AllMarkAllotmentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarkAllotmentRoutingModule {}
