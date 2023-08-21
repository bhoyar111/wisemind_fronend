import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRoleComponent } from "./all-role/all-role.component";

const routes: Routes = [
  {
    path: "all-role",
    component: AllRoleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
