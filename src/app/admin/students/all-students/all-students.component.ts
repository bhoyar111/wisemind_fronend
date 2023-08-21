import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { StudentsService } from "./students.service";
import { dataGenders } from "../../../../utils/constant";

@Component({
  selector: "app-all-students",
  templateUrl: "./all-students.component.html",
  styleUrls: ["./all-students.component.sass"],
})
export class AllStudentsComponent implements OnInit {
  selectedRowData: selectRowInterface;
  register: UntypedFormGroup;
  addstudent: UntypedFormGroup;
  editForm: UntypedFormGroup;
  field: any;
  dataPipe: any;
  data: any[];
  form: FormGroup;
  dataDS: any[];
  dataSectionDS: any[];
  dataGenders = dataGenders;

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private service: StudentsService,
    private router: Router,
    private Arouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.relativeDataFromDS();
    this.fetchDataFromApis();
    this.addstudent = this.fb.group({
      id: [""],
      first_name: ["", Validators.required],
      middle_name: ["", Validators.required],
      last_name: ["", Validators.required],
      roll_no: ["", Validators.required],
      class_id: ["", Validators.required],
      section_id: ["", Validators.required],
      mobile_no: ["", Validators.required],
      gender: ["", Validators.required],
    });

    this.editForm = this.fb.group({
      id: [""],
      first_name: ["", Validators.required],
      middle_name: ["", Validators.required],
      last_name: ["", Validators.required],
      roll_no: ["", Validators.required],
      class_id: ["", Validators.required],
      section_id: ["", Validators.required],
      mobile_no: ["", Validators.required],
      gender: ["", Validators.required],
    });
  }
  relativeDataFromDS() {
    this.service.getDataDS().subscribe((response: any) => {
      this.dataDS = response.classes;
      this.dataSectionDS = response.sections;
    });
  }

  fetchDataFromApis() {
    this.service.getData().subscribe(
      (response: any) => {
        this.data = response.students;
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
      first_name: form.value.first_name,
      middle_name: form.value.middle_name,
      last_name: form.value.last_name,
      roll_no: form.value.roll_no,
      class_id: form.value.class_id,
      section_id: form.value.section_id,
      mobile_no: form.value.mobile_no,
      gender: form.value.gender,
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
      first_name: item.first_name,
      middle_name: item.middle_name,
      last_name: item.last_name,
      roll_no: item.roll_no,
      class_id: item.class_id,
      section_id: item.section_id,
      mobile_no: item.mobile_no,
      gender: item.gender,
    });
    this.selectedRowData = item;
  }

  onEditSave(form: UntypedFormGroup) {
    const updatedData = {
      first_name: form.value.first_name,
      middle_name: form.value.middle_name,
      last_name: form.value.last_name,
      roll_no: form.value.roll_no,
      class_id: form.value.class_id,
      section_id: form.value.section_id,
      mobile_no: form.value.mobile_no,
      gender: form.value.gender,
    };
    this.service.updateOneData(form.value.id, updatedData).subscribe(
      (response) => {
        console.log("Update successful:", response);
        const rowIndex = this.data.findIndex(
          (item) => item.id === form.value.id
        );
        if (rowIndex !== -1) {
          this.data[rowIndex].first_name = form.value.first_name;
          this.data[rowIndex].middle_name = form.value.middle_name;
          this.data[rowIndex].last_name = form.value.last_name;
          this.data[rowIndex].roll_no = form.value.roll_no;
          this.data[rowIndex].class_id = form.value.class_id;
          this.data[rowIndex].section_id = form.value.section_id;
          this.data[rowIndex].mobile_no = form.value.mobile_no;
          this.data[rowIndex].gender = form.value.gender;
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
    name: String;
    first_name: String,
    middle_name: String,
    last_name: String,
    roll_no: String,
    class_id: number,
    section_id: number,
    mobile_no: string,
    gender: string
}
