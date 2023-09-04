import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "master",
    loadChildren: () =>
      import("./master/master.module").then((m) => m.MasterModule),
  },
  {
    path: "staff",
    loadChildren: () =>
      import("./staff/staff.module").then((m) => m.StaffModule),
  },
  {
    path: "students",
    loadChildren: () =>
      import("./students/students.module").then((m) => m.StudentsModule),
  },
  {
    path: "school",
    loadChildren: () =>
      import("./school/school.module").then((m) => m.SchoolModule),
  },
  {
    path: "staff-allotment",
    loadChildren: () =>
    import("./staff-allotment/staff-allotment.module").then((m) => m.StaffAllotmentModule),
  },
  {
    path: "mark-allotment",
    loadChildren: () =>
      import("./mark-allotment/mark-allotment.module").then((m) => m.MarkAllotmentModule),
  },
  {
    path: "mark-allot",
    loadChildren: () =>
      import("./mark-allot/mark-allot.module").then((m) => m.MarkAllotModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
