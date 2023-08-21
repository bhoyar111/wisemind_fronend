import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSchoolComponent } from './all-school/all-school.component'

const routes: Routes = [
  {
    path: 'all-school',
    component: AllSchoolComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
