import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { MarkService } from "./mark.service"

@Component({
  selector: 'app-all-mark',
  templateUrl: './all-mark.component.html',
  styleUrls: ['./all-mark.component.sass']
})
export class AllMarkComponent implements OnInit {

    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addingForm: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDS: any[];
    dataLevelDS: any[];
    filteredLevels: any[];
    dataStudentDS: any[];
    filteredStudents: any[];
    dataSubjectDS: any[];
    dataExamDS: any[];

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: MarkService
    ) { }

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
        this.addingForm = this.fb.group({
        id: [""],
        class_id: ["", Validators.required],
        level_id: ["", Validators.required],
        student_id: ["", Validators.required],
        subject_id: ["", Validators.required],
        exam_id: ["", Validators.required]
        });

        this.editForm = this.fb.group({
        id: [""],
        class_id: ["", Validators.required],
        level_id: ["", Validators.required],
        student_id: ["", Validators.required],
        subject_id: ["", Validators.required],
        exam_id: ["", Validators.required]
        });
    }
    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
            this.dataDS = response.classes;
            this.dataLevelDS = response.levels;
            this.dataStudentDS = response.students;
            this.dataSubjectDS = response.subjects;
            this.dataExamDS = response.exams;
        });
    }

    onFormFilterSelectionChange() {
        const classId = parseInt(this.addingForm.value.class_id);
        if (classId !== 0) {
        this.filteredLevels = this.dataLevelDS.filter(level => level.class_id === classId);
        this.filteredStudents = this.dataStudentDS.filter(student => student.class_id === classId);
        } else {
        this.filteredLevels = [];
        this.filteredLevels = [];
        }
        this.addingForm.patchValue({ level_id: "" });
        this.addingForm.patchValue({ student_id: "" });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe(
        (response: any) => {
            this.data = response.marks;
        },
            (err) => {
                console.log(err, "listing api failed");
            }
        );
    }

    filterDataFromApis() {
        const searchParams = { /* Your search params here */ };
        this.service.getFilterData(searchParams).subscribe((response: any) => {
            this.data = response.marks;
            console.log(response.marks, 'akash');

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
        class_id: form.value.class_id,
        level_id: form.value.level_id,
        student_id: form.value.student_id,
        subject_id: form.value.subject_id,
        exam_id: form.value.exam_id
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
        class_id: item.class_id,
        level_id: item.level_id,
        student_id: item.student_id,
        subject_id: item.subject_id,
        exam_id: item.exam_id
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
        exam_name: form.value.exam_name,
        class_id: form.value.class_id,
        level_id: form.value.level_id,
        student_id: form.value.student_id,
        subject_id: form.value.subject_id,
        exam_id: form.value.exam_id
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe(
        (response) => {
            console.log("Update successful:", response);
            const rowIndex = this.data.findIndex(
            (item) => item.id === form.value.id
            );
            if (rowIndex !== -1) {
            this.data[rowIndex].class_id = form.value.class_id;
            this.data[rowIndex].level_id = form.value.level_id;
            this.data[rowIndex].student_id = form.value.student_id;
            this.data[rowIndex].subject_id = form.value.subject_id;
            this.data[rowIndex].exam_id = form.value.exam_id;
            this.showNotification(
                "snackbar-success", "Updated successfully!", "top", "center");
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
    exam_name: String;
    class_id: number;
    level_id: number;
    student_id: number;
    subject_id: number;
    exam_id: number;
}
