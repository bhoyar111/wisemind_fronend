import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from "@angular/forms";
import { UntypedFormGroup,  UntypedFormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import { StaffService } from "./staff.service";

@Component({
  selector: "app-all-staff",
  templateUrl: "./all-staff.component.html",
  styleUrls: ["./all-staff.component.sass"],
})
export class AllStaffComponent implements OnInit {
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addstaff: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDesignationDS: any[];
    dataRoleDS: any[];
    dataSchoolDS: any[];
    filteredStaff: any[];

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: StaffService,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
        // this.fetchDataSchoolWiseFromApis();
        this.addstaff = this.fb.group({
            id: [""],
            first_name: ["", Validators.required],
            last_name: ["", Validators.required],
            mobile_no: ["", Validators.required],
            email_id: ["", [Validators.required, Validators.email]],
            designation_id: ["", Validators.required],
            school_id: ["", Validators.required],
            role_id: ["", Validators.required],
            password: ["", Validators.required],
        });

        this.editForm = this.fb.group({
            id: [""],
            first_name: ["", Validators.required],
            last_name: ["", Validators.required],
            mobile_no: ["", Validators.required],
            email_id: ["", [Validators.required, Validators.email]],
            school_id: ["", Validators.required],
            designation_id: ["", Validators.required],
            role_id: ["", Validators.required],
            password: ["", Validators.required],
        });
    }
    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
            this.dataDesignationDS = response.designations;
            this.dataRoleDS = response.roles;
            this.dataSchoolDS = response.schools;
        });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe((response: any) => {
                this.data = response.staffs;
        },
            (err) => {
                console.log(err, "listing api failed");
            }
        );
    }

    onClassSelectionChange() {
      const SchoolId = parseInt(this.addstaff.value.school_id);
      if (SchoolId !== 0) {
          this.filteredStaff = this.data.filter(staff => staff.school_id === SchoolId);

      } else {
          this.filteredStaff = [];
      }
      this.addstaff.patchValue({ first_name: "", last_name: "" });
  }

    addRow(content) {
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    }

    onAddRowSave(form: UntypedFormGroup) {
        this.field = {
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            mobile_no: form.value.mobile_no,
            email_id: form.value.email_id,
            designation_id: form.value.designation_id,
            school_id: form.value.school_id,
            role_id: form.value.role_id,
            password: form.value.password
        };

        this.service.addData(this.field).subscribe(
        (response) => {
            if (response.status !== "") {
                this.showNotification("snackbar-success", "Added Successfully!", "top", "center");
                window.location.reload();
            form.reset();
            } else {
                this.showNotification("snackbar-error", "Addition Failed!", "top", "center");
            }
        },
        (error) => {
            console.error("Addition Failed:", error);
            this.showNotification("snackbar-error", "Addition Failed!", "top", "center");
        }
        );
        this.modalService.dismissAll();
    }

    editRow(item, ind, content) {
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
        this.editForm.setValue({
            id: item.id,
            first_name: item.first_name,
            last_name: item.last_name,
            mobile_no: item.mobile_no,
            email_id: item.email_id,
            designation_id: item.designation_id,
            school_id: item.school_id,
            role_id: item.role_id,
            password: item.password
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            mobile_no: form.value.mobile_no,
            email_id: form.value.email_id,
            designation_id: form.value.designation_id,
            school_id: form.value.school_id,
            role_id: form.value.role_id,
            password: form.value.password
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe(
        (response) => {
            console.log("Update successful:", response);
            const rowIndex = this.data.findIndex(
            (item) => item.id === form.value.id
            );
            if (rowIndex !== -1) {
                this.data[rowIndex].first_name = form.value.first_name;
                this.data[rowIndex].last_name = form.value.last_name;
                this.data[rowIndex].mobile_no = form.value.mobile_no;
                this.data[rowIndex].email_id = form.value.email_id;
                this.data[rowIndex].designation_id = form.value.designation_id;
                this.data[rowIndex].school_id = form.value.school_id;
                this.data[rowIndex].role_id = form.value.role_id;
                this.data[rowIndex].password = form.value.password;
                this.showNotification("snackbar-success", "Updated successfully!", "top", "center");
                window.location.reload();
            } else {
            this.showNotification("snackbar-error", "Not found!", "top", "center");
            }
        },
        (error) => {
            console.error("Update failed:", error);
            this.showNotification("snackbar-error", "Update failed!", "top", "center");
        }
        );
        this.modalService.dismissAll();
        return true;
    }

    deleteRow(row: any) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons
        .fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "YES, DELETE IT!",
            cancelButtonText: "NO, CANCEL!",
            reverseButtons: true
        })
        .then((result) => {
            if (result.value) {
            this.service.deleteOneData(row.id).subscribe(
                (res) => {
                    this.dataPipe = this.service.json_convert(res);
                    if (this.dataPipe.status == 1) {
                        swalWithBootstrapButtons.fire("Deleted!", "Your Record has been deleted.", "success");

                        this.data = this.arrayRemove(this.data, row.id);
                        let sr = 1;
                        this.data.filter((value, key) => {
                        this.data[key].sr = sr++;
                        });
                    }
                },
                (error) => {
                console.error("Error deleting record:", error);
                    swalWithBootstrapButtons.fire("Error", "Failed to delete the record.", "error");
                }
            );
            window.location.reload();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire("Cancelled", "Your Record is safe :)", "error");
            }
        });
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, "", {
            duration: 2000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName
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
    first_name: String;
    last_name: String;
    mobile_no: number;
    email_id: String;
    designation_id: number;
    school_id: number;
    role_id: number;
    password: String;
}
