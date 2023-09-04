import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllGameComponent } from "./all-game/all-game.component";

const routes: Routes = [
  {
    path: "all-game",
    component: AllGameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
