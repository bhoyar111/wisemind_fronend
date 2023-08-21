import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-mark",
  templateUrl: "./edit-mark.component.html",
  styleUrls: ["./edit-mark.component.sass"],
})
export class EditMarkComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateMarkAllot() {
    this.router.navigate(["/admin/mark-allot/mark-allot"]);
  }
  navigateToAddMark() {
    this.router.navigate(["/admin/mark-allot/add-mark"]);
  }

  navigateToEditMark() {
      this.router.navigate(["/admin/mark-allot/edit-mark"]);
  }

  backToMark() {
    this.router.navigate(["/admin/mark-allot/mark-allot"]);
  }
}
