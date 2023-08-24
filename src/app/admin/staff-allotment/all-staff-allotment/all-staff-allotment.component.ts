import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { StaffAllotmentService } from "./staff-allotment.service";

@Component({
  selector: "app-all-staff-allotment",
  templateUrl: "./all-staff-allotment.component.html",
  styleUrls: ["./all-staff-allotment.component.sass"],
})
export class AllStaffAllotmentComponent implements OnInit {
  selectedRowData: selectRowInterface;
  register: UntypedFormGroup;
  addStaff: UntypedFormGroup;
  editForm: UntypedFormGroup;
  field: any;
  dataPipe: any;
  data: any[];
  form: FormGroup;
  dataStaffDS: any[];
  dataClassDS: any[];
  dataLevelDS: any[];
  filteredLevels: any[];
  dataSubjectDS: any[];
  filteredSubjects: any[];

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private service: StaffAllotmentService,
    private router: Router,
    private Arouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.relativeDataFromDS();
    this.fetchDataFromApis();
    this.addStaff = this.fb.group({
      id: [""],
      staff_id: ["", Validators.required],
      class_id: ["", Validators.required],
      level_id: ["", Validators.required],
      subject_id: ["", Validators.required],
    });

    this.editForm = this.fb.group({
      id: [""],
      staff_id: ["", Validators.required],
      class_id: ["", Validators.required],
      level_id: ["", Validators.required],
      subject_id: ["", Validators.required],
    });
  }
  relativeDataFromDS() {
    this.service.getDataDS().subscribe((response: any) => {
      this.dataStaffDS = response.staffs;
      this.dataClassDS = response.classes;
      this.dataLevelDS = response.levels;
      this.dataSubjectDS = response.subjects;
    });
  }

  onClassSelectionChange() {
    const classId = parseInt(this.addStaff.value.class_id);
    if (classId !== 0) {
      this.filteredLevels = this.dataLevelDS.filter((level) => level.class_id === classId);
      this.filteredSubjects = this.dataSubjectDS.filter((subject) => subject.class_id === classId);
    } else {
      this.filteredLevels = [];
      this.filteredLevels = [];
    }
    this.addStaff.patchValue({ level_id: "" });
    this.addStaff.patchValue({ subject_id: "" });
  }

  fetchDataFromApis() {
    this.service.getData().subscribe(
      (response: any) => {
        this.data = response.staffAllocations;
      },
      (err) => {
        console.log(err, "listing api failed");
      }
    );
  }

  addRow(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  onAddRowSave(form: UntypedFormGroup) {
    this.field = {
      staff_id: form.value.staff_id,
      class_id: form.value.class_id,
      level_id: form.value.level_id,
      subject_id: form.value.subject_id
    };

    this.service.addData(this.field).subscribe(
      (response) => {
        if (response.status !== "") {
          this.showNotification(
            "snackbar-success",
            "Added Successfully!",
            "top",
            "center"
          );
          window.location.reload();
          form.reset();
        } else {
          this.showNotification(
            "snackbar-error",
            "Addition Failed!",
            "top",
            "center"
          );
        }
      },
      (error) => {
        console.error("Addition Failed:", error);
        this.showNotification(
          "snackbar-error",
          "Addition Failed!",
          "top",
          "center"
        );
      }
    );
    this.modalService.dismissAll();
  }

  editRow(item, ind, content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    this.editForm.setValue({
      id: item.id,
      staff_id: item.staff_id,
      class_id: item.class_id,
      level_id: item.level_id,
      subject_id: item.subject_id
    });
    this.selectedRowData = item;
  }

  onEditSave(form: UntypedFormGroup) {
    const updatedData = {
      staff_id: form.value.staff_id,
      class_id: form.value.class_id,
      level_id: form.value.level_id,
      subject_id: form.value.subject_id,
    };
    this.service.updateOneData(form.value.id, updatedData).subscribe(
      (response) => {
        console.log("Update successful:", response);
        const rowIndex = this.data.findIndex(
          (item) => item.id === form.value.id
        );
        if (rowIndex !== -1) {
          this.data[rowIndex].staff_id = form.value.staff_id;
          this.data[rowIndex].class_id = form.value.class_id;
          this.data[rowIndex].level_id = form.value.level_id;
          this.data[rowIndex].subject_id = form.value.subject_id;
          this.showNotification(
            "snackbar-success",
            "Updated successfully!",
            "top",
            "center"
          );
          window.location.reload();
        } else {
          this.showNotification(
            "snackbar-error",
            "Not found!",
            "top",
            "center"
          );
        }
      },
      (error) => {
        console.error("Update failed:", error);
        this.showNotification(
          "snackbar-error",
          "Update failed!",
          "top",
          "center"
        );
      }
    );
    this.modalService.dismissAll();
    return true;
  }

  deleteRow(row: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "YES, DELETE IT!",
        cancelButtonText: "NO, CANCEL!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.service.deleteOneData(row.id).subscribe(
            (res) => {
              this.dataPipe = this.service.json_convert(res);
              if (this.dataPipe.status == 1) {
                swalWithBootstrapButtons.fire(
                  "Deleted!",
                  "Your Record has been deleted.",
                  "success"
                );

                this.data = this.arrayRemove(this.data, row.id);
                let sr = 1;
                this.data.filter((value, key) => {
                  this.data[key].sr = sr++;
                });
              }
            },
            (error) => {
              console.error("Error deleting record:", error);
              swalWithBootstrapButtons.fire(
                "Error",
                "Failed to delete the record.",
                "error"
              );
            }
          );
          window.location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your Record is safe :)",
            "error"
          );
        }
      });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this._snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  arrayRemove(array, id) {
    return array.filter(function (element) {
      return element.id != id;
    });
  }
}

export interface selectRowInterface {
  sr: String;
  staff_id: number;
  class_id: number;
  level_id: number;
  subject_id: number;
}
