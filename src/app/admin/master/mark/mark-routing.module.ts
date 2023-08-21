import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllMarkComponent } from "./all-mark/all-mark.component";

const routes: Routes = [
    {
        path: "all-mark",
        component: AllMarkComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MarkRoutingModule { }
