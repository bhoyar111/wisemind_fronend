import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "classes",
    loadChildren: () =>
      import("./classes/classes.module").then((m) => m.ClassesModule),
  },
  {
    path: "level",
    loadChildren: () =>
      import("./level/level.module").then((m) => m.LevelModule),
  },
  {
    path: "section",
    loadChildren: () =>
      import("./section/section.module").then((m) => m.SectionModule),
  },
  {
    path: "subject",
    loadChildren: () =>
      import("./subject/subject.module").then((m) => m.SubjectModule),
  },
  {
    path: "exam",
    loadChildren: () => import("./exam/exam.module").then((m) => m.ExamModule),
  },
  {
    path: "designation",
    loadChildren: () =>
      import("./designation/designation.module").then(
        (m) => m.DesignationModule
      ),
  },
  {
    path: "role",
    loadChildren: () => import("./role/role.module").then((m) => m.RoleModule),
  },
  {
    path: "mark",
    loadChildren: () => import("./mark/mark.module").then((m) => m.MarkModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
