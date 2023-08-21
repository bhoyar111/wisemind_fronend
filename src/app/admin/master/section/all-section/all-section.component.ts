import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from "@angular/forms";
import Swal from "sweetalert2";
import { SectionService } from "./section.service";
@Component({
  selector: "app-all-section",
  templateUrl: "./all-section.component.html",
  styleUrls: ["./all-section.component.sass"],
})
export class AllSectionComponent implements OnInit {
  selectedRowData: selectRowInterface;
  register: UntypedFormGroup;
  addsection: UntypedFormGroup;
  editForm: UntypedFormGroup;
  field: any;
  dataPipe: any;
  data: any[];
  form: FormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal,
    private service: SectionService,
    private router: Router,
    private Arouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchDataFromApis();
    this.addsection = this.fb.group({
      id: [""],
      section_name: ["", Validators.required]
    });

    this.editForm = this.fb.group({
      id: [""],
      section_name: ["", Validators.required]
    });
  }

  // for api data fetching
  fetchDataFromApis() {
    this.service.getData().subscribe(
      (response: any) => {
        this.data = response.sections;
      },
      (err) => {
        console.log(err, "listing api failed");
      }
    );
  }

  addRow(content) {
    this.modalService.open(content, { ariaLabelledBy: "modal-basic-title" });
  }

  aaonAddRowSave(form: UntypedFormGroup) {
    this.field = {
      section_name: form.value.section_name
    };
    this.service.addData(this.field).subscribe((res) => {
      if (res.status !== "") {
        this.showNotification("snackbar-success","Add successfully!","top","center");
      }
      form.reset();
    });

    this.modalService.dismissAll();
    window.location.reload();
  }

  onAddRowSave(form: UntypedFormGroup) {
    this.field = {
      section_name: form.value.section_name
    };

    this.service.addData(this.field).subscribe(
      (response) => {
        if (response.status !== "") {
          this.showNotification("snackbar-success","Added Successfully!","top","center");
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
      section_name: item.section_name
    });
    this.selectedRowData = item;
  }

  onEditSave(form: UntypedFormGroup) {
    const updatedData = {
      section_name: form.value.section_name
    };
    this.service.updateOneData(form.value.id, updatedData).subscribe(
      (response) => {
        console.log("Update successful:", response);
        const rowIndex = this.data.findIndex(
          (item) => item.id === form.value.id
        );
        if (rowIndex !== -1) {
          this.data[rowIndex].section_name = form.value.section_name;
          this.showNotification("snackbar-success","Updated successfully!","top","center");
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
          this.service.deleteOneData(row.id).subscribe((res) => {
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
  section_name: String;
}