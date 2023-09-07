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

import { SchoolService } from "./school.service";
@Component({
  selector: "app-all-school",
  templateUrl: "./all-school.component.html",
  styleUrls: ["./all-school.component.sass"],
})
export class AllSchoolComponent implements OnInit {
  selectedRowData: selectRowInterface;
  register: UntypedFormGroup;
  addschool: UntypedFormGroup;
  editForm: UntypedFormGroup;
  numericPattern = "^[0-9]*$";
  field: any;
  dataPipe: any;
  data: any[];
  form: FormGroup;
  dataRoleDS: any[];
  searchTerm: string = "";
  filteredData: any[] = [];
  showAllData: boolean = true;

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private service: SchoolService,
    private router: Router,
    private Arouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.relativeDataFromDS();
    this.fetchDataFromApis();
    this.addschool = this.fb.group({
      id: [""],
      school_name: ["", Validators.required],
      address: ["", Validators.required],
      city_name: ["", Validators.required],
      district_name: ["", Validators.required],
      state: ["", Validators.required],
      pin_code: ["", Validators.required],
      affilition_no: ["", Validators.required],
      email_id: ["", [Validators.required, Validators.email]], // Email validation added
      mobile_no: [
        "",
        [
          Validators.required,
          Validators.pattern(this.numericPattern),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      role_id: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.editForm = this.fb.group({
      id: [""],
      school_name: ["", Validators.required],
      address: ["", Validators.required],
      city_name: ["", Validators.required],
      district_name: ["", Validators.required],
      state: ["", Validators.required],
      pin_code: ["", Validators.required],
      affilition_no: ["", Validators.required],
      email_id: ["", [Validators.required, Validators.email]], // Email validation added
      mobile_no: [
        "",
        [
          Validators.required,
          Validators.pattern(this.numericPattern),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      role_id: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  get f() {
    return this.addschool.controls;
  }

  get e() {
    return this.editForm.controls;
  }
  // for api data fetching
  relativeDataFromDS() {
    this.service.getDataDS().subscribe((response: any) => {
      this.dataRoleDS = response.roles;
      console.log(response.roles, "response.roles");
    });
  }

  fetchDataFromApis() {
    this.service.getData().subscribe(
      (response: any) => {
        this.data = response.schools;
        // Load all data initially
        this.filteredData = [...this.data];
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
      school_name: form.value.school_name,
      address: form.value.address,
      city_name: form.value.city_name,
      district_name: form.value.district_name,
      state: form.value.state,
      pin_code: form.value.pin_code,
      affilition_no: form.value.affilition_no,
      email_id: form.value.email_id,
      mobile_no: form.value.mobile_no,
      role_id: form.value.role_id,
      password: form.value.password,
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
      school_name: item.school_name,
      address: item.address,
      city_name: item.city_name,
      district_name: item.district_name,
      state: item.state,
      pin_code: item.pin_code,
      affilition_no: item.affilition_no,
      email_id: item.email_id,
      mobile_no: item.mobile_no,
      role_id: item.role_id,
      password: item.password,
    });
    this.selectedRowData = item;
  }

  onEditSave(form: UntypedFormGroup) {
    const updatedData = {
      school_name: form.value.school_name,
      address: form.value.address,
      city_name: form.value.city_name,
      district_name: form.value.district_name,
      state: form.value.state,
      pin_code: form.value.pin_code,
      affilition_no: form.value.affilition_no,
      email_id: form.value.email_id,
      mobile_no: form.value.mobile_no,
      role_id: form.value.role_id,
      password: form.value.password,
    };
    this.service.updateOneData(form.value.id, updatedData).subscribe(
      (response) => {
        console.log("Update successful:", response);
        const rowIndex = this.data.findIndex(
          (item) => item.id === form.value.id
        );
        if (rowIndex !== -1) {
          this.data[rowIndex].school_name = form.value.school_name;
          this.data[rowIndex].address = form.value.address;
          this.data[rowIndex].city_name = form.value.city_name;
          this.data[rowIndex].district_name = form.value.district_name;
          this.data[rowIndex].state = form.value.state;
          this.data[rowIndex].pin_code = form.value.pin_code;
          this.data[rowIndex].affilition_no = form.value.affilition_no;
          this.data[rowIndex].email_id = form.value.email_id;
          this.data[rowIndex].mobile_no = form.value.mobile_no;
          this.data[rowIndex].role_id = form.value.role_id;
          this.data[rowIndex].password = form.value.password;
          this.showNotification(
            "snackbar-success",
            "Updated successfully!",
            "top",
            "center"
          );
        } else {
          this.showNotification(
            "snackbar-error",
            "Class not found!",
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

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      this.showAllData = true;
    } else {
      this.filteredData = this.data.filter((item) =>
        item.school_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.city_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.affilition_no.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email_id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.mobile_no.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.showAllData = false;
    }
  }

}
export interface selectRowInterface {
  sr: String;
  school_name: String;
  address: String;
  city_name: String;
  district_name: String;
  state: String;
  pin_code: number;
  affilition_no: number;
  email_id: String;
  mobile_no: number;
  role_id: number;
  password: String;
}
