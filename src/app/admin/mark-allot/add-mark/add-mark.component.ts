import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormGroup, UntypedFormBuilder, Validators,  } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MarkAllotService } from "../mark-allot/mark-allot.service"

@Component({
  selector: "app-add-mark",
  templateUrl: "./add-mark.component.html",
  styleUrls: ["./add-mark.component.sass"],
})
export class AddMarkComponent implements OnInit {

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
    dataStudentDS: any[];
    filteredStudent: any[];

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: MarkAllotService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
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


  navigateMarkAllot() {
    this.router.navigate(["/admin/mark-allot/mark-allot"]);
  }
  backToMark() {
    this.router.navigate(["/admin/mark-allot/mark-allot"]);
  }

    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
          this.dataDS = response.classes;
          this.dataSubjectDS = response.subjects;
          this.dataExamDS = response.exams;
          this.dataStudentDS = response.students;
        });
    }

    onClassSelectionChange() {
        const classId = parseInt(this.addForm.value.class_id);
        if (classId !== 0) {
            this.filteredSubject = this.dataSubjectDS.filter(subject => subject.class_id === classId);
            this.filteredExam = this.dataExamDS.filter(exam => exam.class_id === classId);
            this.filteredStudent = this.dataStudentDS.filter(student => student.class_id === classId);
        } else {
            this.filteredSubject = [];
            this.filteredExam = [];
            this.filteredStudent = [];
        }
        this.addForm.patchValue({ subject_id: "" });
        this.addForm.patchValue({ exam_id: "" });
        this.addForm.patchValue({ student_id: "" });
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

