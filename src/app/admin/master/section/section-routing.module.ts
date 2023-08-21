

import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllSectionComponent } from "./all-section/all-section.component";

const routes: Routes = [
  {
    path: "all-section",
    component: AllSectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionRoutingModule {}
