import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { QuestionsService } from './questions.service';
import { dataExamSection } from "../../../../../utils/constant";

@Component({
  selector: "app-all-questions",
  templateUrl: "./all-questions.component.html",
  styleUrls: ["./all-questions.component.sass"],
})
export class AllQuestionsComponent implements OnInit {
    shouldApplyStaffHideClass: boolean = false;
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addForm: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDS: any[];
    dataSubjectDS: any[];
    filteredSubject: any[];
    examSectionFilter: any[];
    dataExamSection= dataExamSection;
    searchTerm: string = "";
    filteredData: any[] = [];
    showAllData: boolean = true;

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: QuestionsService,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
        this.addForm = this.fb.group({
            id: [""],
            class_id: ["", Validators.required],
            subject_id: ["", Validators.required],
            exam_section: ["", Validators.required],
            question_name: ["", Validators.required]
        });

        this.editForm = this.fb.group({
            id: [""],
            class_id: ["", Validators.required],
            subject_id: ["", Validators.required],
            exam_section: ["", Validators.required],
            question_name: ["", Validators.required]
        });
    }

    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
            this.dataDS = response.classes;
            this.dataSubjectDS = response.subjects;
        });
    }

    onClassSelectionChange() {
        const classId = parseInt(this.addForm.value.class_id);
        if (classId !== 0) {
        this.filteredSubject = this.dataSubjectDS.filter(subject => subject.class_id === classId);
        } else {
        this.filteredSubject = [];
        }
        this.addForm.patchValue({ subject_id: "" });
    }

    onExamSectionSelectionChange() {
        this.shouldApplyStaffHideClass = true;
        const examSectionValue = this.addForm.value.exam_section;
        if (examSectionValue !== undefined  && examSectionValue.trim() !== '') {
            this.examSectionFilter = this.data.filter(exam => exam.exam_section === examSectionValue);
        } else {
            this.examSectionFilter = [];
        }
        this.addForm.patchValue({ question_name: "" });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe((response: any) => {
            this.data = response.questions;
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
            class_id: form.value.class_id,
            subject_id: form.value.subject_id,
            exam_section: form.value.exam_section,
            question_name: form.value.question_name
        };

        this.service.addData(this.field).subscribe((response) => {
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
            class_id: item.class_id,
            subject_id: item.subject_id,
            exam_section: item.exam_section,
            question_name: item.question_name
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
            class_id: form.value.class_id,
            subject_id: form.value.subject_id,
            exam_section: form.value.exam_section,
            question_name: form.value.question_name
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe((response) => {
            const rowIndex = this.data.findIndex((item) => item.id === form.value.id);
            if (rowIndex !== -1) {
            this.data[rowIndex].class_id = form.value.class_id;
            this.data[rowIndex].subject_id = form.value.subject_id;
            this.data[rowIndex].exam_section = form.value.exam_section;
            this.data[rowIndex].question_name = form.value.question_name;
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

    onSearchChange() {
      if (!this.searchTerm.trim()) {
          this.filteredData = [...this.data];
          this.showAllData = true; // Set the flag to show all data
      } else {
          this.filteredData = this.data.filter((item) =>
              item.class.class_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              item.subject.subject_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              item.exam_section.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
              item.question_name.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.showAllData = false; // Set the flag to show filtered data
      }
  }
}

export interface selectRowInterface {
    sr: String;
    class_id: Number;
    subject_id: Number;
    exam_section: String;
    question_name: String;
}

