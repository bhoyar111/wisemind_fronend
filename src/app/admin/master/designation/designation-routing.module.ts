import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllDesignationComponent } from "./all-designation/all-designation.component";

const routes: Routes = [
  {
    path: "all-designation",
    component: AllDesignationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignationRoutingModule {}
