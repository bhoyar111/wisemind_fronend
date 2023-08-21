import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: "app-all-mark-allotment",
  templateUrl: "./all-mark-allotment.component.html",
  styleUrls: ["./all-mark-allotment.component.sass"],
})
export class AllMarkAllotmentComponent implements OnInit {
  // for listing coulumn name
  displayedColumns = ["id", "student", "class", "level", "subject", "exam"];

  // for breadcrums
  breadscrums = [
    {
      title: "All Mark Allotment",
      items: ["Mark Allotment"],
      active: "All Mark Allotment",
    },
  ];

  selectedRowData: selectRowInterface;
  register: UntypedFormGroup;
  addclass: UntypedFormGroup;
  editForm: UntypedFormGroup;
  field: any;

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.addclass = this.fb.group({
      id: [""],
      name: ["", Validators.required],
    });

    this.editForm = this.fb.group({
      id: [""],
      name: ["", Validators.required],
    });
  }

  refresh() {
    // this.loadData();
  }

  // For add function
  addRow(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    this.register.patchValue({
      id: 1,
    });
  }

  // for adding row
  onAddRowSave(form: UntypedFormGroup) {
    this.field = {
      name: form.value.name,
    };
  }

  // for edit row
  editRow(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
    this.editForm.setValue({});
  }

  // for passing parameter
  passParameter(row: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "YES, DELETE IT!",
      cancelButtonText: "NO, CANCEL!",
      reverseButtons: true,
    });
  }

  // for deleted row
  deleteRow() {
    console.log("deleted");
  }
}

// imported row interface
export interface selectRowInterface {
  sr: String;
  name: String;
}
