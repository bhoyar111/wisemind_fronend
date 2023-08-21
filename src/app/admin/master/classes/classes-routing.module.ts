
import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllClassesComponent } from "./all-classes/all-classes.component";

const routes: Routes = [
  {
    path: "all-classes",
    component: AllClassesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassRoutingModule {}

