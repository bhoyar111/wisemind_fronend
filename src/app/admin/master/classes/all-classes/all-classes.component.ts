import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from "@angular/forms";
import { ExportAsService, ExportAsConfig, SupportedExtensions, } from "ngx-export-as";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

import { ClassService } from "./class.service";
@Component({
  selector: "app-all-classes",
  templateUrl: "./all-classes.component.html",
  styleUrls: ["./all-classes.component.scss"],
})
export class AllClassesComponent implements OnInit {
    @ViewChild("table", { static: false }) table: ElementRef;
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addclass: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    formData: FormGroup;
    file: File | null = null;
    sheetData: any[] = [];
    searchTerm: string = "";
    filteredData: any[] = [];
    showAllData: boolean = true;

    constructor(
        private exportAsService: ExportAsService,
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: ClassService,
    ) {}

    ngOnInit(): void {
        this.fetchDataFromApis();
        this.addclass = this.fb.group({
        id: [""],
        class_name: ["", Validators.required],
        });

        this.formData = this.fb.group({
        id: [""],
        class_name: ["", Validators.required],
        });

        this.editForm = this.fb.group({
        id: [""],
        class_name: ["", Validators.required],
        });
    }

    // for api data fetching
    fetchDataFromApis() {
        this.service.getData().subscribe(
        (response: any) => {
            this.data = response.classes;
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
        class_name: form.value.class_name,
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
            console.error("Class Addition Failed:", error);
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
        class_name: item.class_name,
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
        class_name: form.value.class_name,
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe(
        (response) => {
            console.log("Update successful:", response);
            const rowIndex = this.data.findIndex(
            (item) => item.id === form.value.id
            );
            if (rowIndex !== -1) {
            this.data[rowIndex].class_name = form.value.class_name;
            this.showNotification(
                "snackbar-success",
                "Class updated successfully!",
                "top",
                "center"
            );
            window.location.reload();
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
        panelClass: colorName
        });
    }

    arrayRemove(array, id) {
        return array.filter(function (element) {
        return element.id != id;
        });
    }

    // For filter data
    onSearchChange() {
      if (!this.searchTerm.trim()) {
          this.filteredData = [...this.data];
          this.showAllData = true; // Set the flag to show all data
      } else {
          this.filteredData = this.data.filter((item) =>
            item.class_name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.showAllData = false; // Set the flag to show filtered data
      }
    }

    // For Import Export
    handleFileDrop(files: FileList): void {
        if (files.length > 0) {
            const uploadedFile = files[0];
            const fileReader = new FileReader();

            fileReader.onload = (event: any) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                this.sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                console.log("Data from XLSX file:", this.sheetData);
                this.data = this.sheetData;
                this.file = uploadedFile;
            };
        fileReader.readAsArrayBuffer(uploadedFile);
        }
    }

    handleFileUpload(): void {
        if (this.file && this.sheetData.length > 0) {
            this.sheetData.forEach((rowData) => {
                console.log("rowData", rowData);

                const formData = new FormData();
                formData.append("file", this.file, this.file.name);
                formData.append("sheetData", JSON.stringify(rowData));
            });
        }
    }

    exportToExcel(): void {
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'classes-list.xlsx');
    }

    onUploadRowSave(form: UntypedFormGroup) {
        this.field = {
        class_name: form.value.class_name,
        };

        this.service.uploadData(this.field).subscribe((response) => {
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
            console.error("Class Addition Failed:", error);
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
}

export interface selectRowInterface {
  sr: String;
  class_name: String;
}
