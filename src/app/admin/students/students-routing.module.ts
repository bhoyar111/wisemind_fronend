import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllStudentsComponent } from "./all-students/all-students.component";

const routes: Routes = [
  {
    path: "all-students",
    component: AllStudentsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
