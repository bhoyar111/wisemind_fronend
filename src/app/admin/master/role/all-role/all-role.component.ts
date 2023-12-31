import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";

import { RoleService } from './role.service'

@Component({
  selector: "app-all-role",
  templateUrl: "./all-role.component.html",
  styleUrls: ["./all-role.component.sass"],
})
export class AllRoleComponent implements OnInit {
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addrole: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe:any;
    data: any[];
    form: FormGroup;
    searchTerm: string = "";
  filteredData: any[] = [];
  showAllData: boolean = true;

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service : RoleService,
        private router: Router,
        private Arouter: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.fetchDataFromApis();
        this.addrole = this.fb.group({
          id: [""],
          role_name: ["", Validators.required]
        });

        this.editForm = this.fb.group({
          id: [""],
          role_name: ["", Validators.required]
        });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe((response: any) => {
            this.data = response.roles;
            // Load all data initially
            this.filteredData = [...this.data];
            },
            (err) => {
                console.log(err, "listing api failed");
            }
        );
    }

    addRow(content) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }

    onAddRowSave(form: UntypedFormGroup) {
        this.field = {
            role_name: form.value.role_name
        };

        this.service.addData(this.field).subscribe((response) => {
            if (response.status !== "") {
                this.showNotification( "snackbar-success", "Added Successfully!", "top", "center");
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
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
        this.editForm.setValue({
            id: item.id,
            role_name: item.role_name
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
            role_name: form.value.role_name
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe((response) => {
            console.log('Update successful:', response);
            const rowIndex = this.data.findIndex((item) => item.id === form.value.id);
            if (rowIndex !== -1) {
              this.data[rowIndex].role_name = form.value.role_name;
              this.showNotification('snackbar-success', 'Updated successfully!', 'top', 'center');
            } else {
              this.showNotification('snackbar-error', 'not found!', 'top', 'center');
            }
          },
          (error) => {
            console.error('Update failed:', error);
            this.showNotification('snackbar-error', 'Update failed!', 'top', 'center');
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
                reverseButtons: true
            })
            .then((result) => {
            if (result.value) {
                this.service.deleteOneData(row.id).subscribe((res) => {
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
                    swalWithBootstrapButtons.fire("Error","Failed to delete the record.","error");
                }
                );
                window.location.reload();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire("Cancelled", "Your Record is safe :)", "error");
            }
        });
    }

    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, '', {
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

    onSearchChange() {
      if (!this.searchTerm.trim()) {
        this.filteredData = [...this.data];
        this.showAllData = true;
      } else {
        this.filteredData = this.data.filter((item) =>
          item.role_name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.showAllData = false;
      }
    }
}

export interface selectRowInterface {
  sr: String;
  role_name: String;
}
