import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
// import Swal from "sweetalert2";
import { QuestionsService } from '../../master/questions/all-questions/questions.service';
import { dataExamSection } from "../../../../utils/constant";

@Component({
  selector: "app-edit-mark",
  templateUrl: "./edit-mark.component.html",
  styleUrls: ["./edit-mark.component.sass"],
})
export class EditMarkComponent implements OnInit {
  shouldApplyStaffHideClass: boolean = false;
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDS: any[];
    dataSubjectDS: any[];
    filteredSubject: any[];
    examSectionFilter: any[];
    dataExamSection= dataExamSection;

    constructor(
      private fb: UntypedFormBuilder,
      private _snackBar: MatSnackBar,
      private modalService: NgbModal,
      private service: QuestionsService,
      private router: Router,
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
}

relativeDataFromDS() {
    this.service.getDataDS().subscribe((response: any) => {
        this.dataDS = response.classes;
        this.dataSubjectDS = response.subjects;
    });
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
    },
    (err) => {
        console.log(err, "listing api failed");
    }
    );
}

  backToMark() {
    this.router.navigate(["/admin/mark-allot/mark-allot"]);
  }
}
export interface selectRowInterface {
  sr: String;
  class_id: Number;
  subject_id: Number;
  exam_section: String;
  question_name: String;
}
