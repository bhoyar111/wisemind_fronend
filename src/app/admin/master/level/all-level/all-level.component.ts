import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { LevelService } from "./level.service"

@Component({
  selector: "app-all-level",
  templateUrl: "./all-level.component.html",
  styleUrls: ["./all-level.component.sass"],
})
export class AllLevelComponent implements OnInit {
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addlevel: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDS: any[];
    searchTerm: string = "";
    filteredData: any[] = [];
    showAllData: boolean = true;

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: LevelService,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
        this.addlevel = this.fb.group({
        id: [""],
        level_name: ["", Validators.required],
        class_id: ["", Validators.required]
        });

        this.editForm = this.fb.group({
        id: [""],
        level_name: ["", Validators.required],
        class_id: ["", Validators.required]
        });
    }

    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
        this.dataDS = response.classes;
        });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe((response: any) => {
            this.data = response.levels;
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
        level_name: form.value.level_name,
        class_id: form.value.class_id
        };

        this.service.addData(this.field).subscribe(
        (response) => {
            if (response.status !== "") {
            this.showNotification("snackbar-success", "Added Successfully!", "top", "center");
            window.location.reload();
            form.reset();
            } else {
            this.showNotification("snackbar-error","Addition Failed!","top","center");
            }
        },
        (error) => {
            console.error("Addition Failed:", error);
            this.showNotification("snackbar-error","Addition Failed!","top","center");
        }
        );
        this.modalService.dismissAll();
    }

    editRow(item, ind, content) {
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
        this.editForm.setValue({
        id: item.id,
        level_name: item.level_name,
        class_id: item.class_id
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
        level_name: form.value.level_name,
        class_id: form.value.class_id
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe(
        (response) => {
            console.log("Update successful:", response);
            const rowIndex = this.data.findIndex(
            (item) => item.id === form.value.id
            );
            if (rowIndex !== -1) {
            this.data[rowIndex].level_name = form.value.level_name;
            this.data[rowIndex].class_id = form.value.class_id;
            this.showNotification("snackbar-success","Updated successfully!","top","center");
            window.location.reload();
            } else {
            this.showNotification("snackbar-error","Not found!","top","center");
            }
        },
        (error) => {
            console.error("Update failed:", error);
            this.showNotification("snackbar-error","Update failed!","top","center");
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
            this.service.deleteOneData(row.id).subscribe(
                (res) => {
                this.dataPipe = this.service.json_convert(res);
                if (this.dataPipe.status == 1) {
                    swalWithBootstrapButtons.fire("Deleted!","Your Record has been deleted.","success");

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
            swalWithBootstrapButtons.fire("Cancelled","Your Record is safe :)","error");
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
            this.showAllData = true; // Set the flag to show all data
        } else {
            this.filteredData = this.data.filter((item) =>
            item.level_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.class.class_name.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
            this.showAllData = false; // Set the flag to show filtered data
        }
    }

}
export interface selectRowInterface {
  sr: String;
  level_name: String;
  class_id: Number;
}
