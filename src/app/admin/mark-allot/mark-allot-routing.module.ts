import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMarkComponent } from './add-mark/add-mark.component'
import { MarkAllotComponent } from './mark-allot/mark-allot.component';
import { EditMarkComponent } from "./edit-mark/edit-mark.component";

const routes: Routes = [
  {
    path: "mark-allot",
    component: MarkAllotComponent,
  },
  {
    path: "add-mark",
    component: AddMarkComponent,
  },
  {
    path: "edit-mark",
    component: EditMarkComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkAllotRoutingModule { }
