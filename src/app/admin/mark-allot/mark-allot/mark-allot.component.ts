import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormGroup, UntypedFormBuilder, Validators,  } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { MarkAllotService } from "./mark-allot.service"

@Component({
  selector: 'app-mark-allot',
  templateUrl: './mark-allot.component.html',
  styleUrls: ['./mark-allot.component.sass']
})
export class MarkAllotComponent implements OnInit {

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
    dataExamDS: any[];
    filteredExam: any[];

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: MarkAllotService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        // this.fetchDataFromApis();
        this.addForm = this.fb.group({
          id: [""],
          class_id: ["", Validators.required],
          level_id: ["", Validators.required],
          subject_id: ["", Validators.required],
          exam_id: ["", Validators.required],
          outoff: ["", Validators.required],
          obtain: ["", Validators.required]
        });
    }

    navigateToAddMark() {
        this.router.navigate(["/admin/mark-allot/add-mark"]);
    }

    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
          this.dataDS = response.classes;
          this.dataSubjectDS = response.subjects;
          this.dataExamDS = response.exams;
        });
    }

    onClassSelectionChange() {
        const classId = parseInt(this.addForm.value.class_id);
        if (classId !== 0) {
            this.filteredSubject = this.dataSubjectDS.filter(subject => subject.class_id === classId);
            this.filteredExam = this.dataExamDS.filter(exam => exam.class_id === classId);
        } else {
            this.filteredSubject = [];
            this.filteredExam = [];
        }
        this.addForm.patchValue({ subject_id: "" });
        this.addForm.patchValue({ exam_id: "" });
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

    getMarkAllotmentList() {
        this.fetchDataFromApis();
    }

    addRow(content) {
        this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    }

    onAddRowSave(form: UntypedFormGroup) {
        this.field = {
            exam_name: form.value.exam_name,
            class_id: form.value.class_id,
            level_id: form.value.level_id,
            subject_id: form.value.subject_id,
            outoff: form.value.outoff
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
    name: String;
}
