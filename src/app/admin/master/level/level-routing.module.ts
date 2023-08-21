import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllLevelComponent } from "./all-level/all-level.component";

const routes: Routes = [
  {
    path: "all-level",
    component: AllLevelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LevelRoutingModule {}
