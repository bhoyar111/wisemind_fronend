import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllExamComponent } from "./all-exam/all-exam.component";

const routes: Routes = [
  {
    path: "all-exam",
    component: AllExamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamRoutingModule {}
