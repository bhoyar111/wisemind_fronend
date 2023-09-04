import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormGroup } from "@angular/forms";
import { dataGameType } from "../../../../../utils/constant";
import { UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { GameService } from "./game.service";

@Component({
  selector: "app-all-game",
  templateUrl: "./all-game.component.html",
  styleUrls: ["./all-game.component.sass"],
})
export class AllGameComponent implements OnInit {
    selectedRowData: selectRowInterface;
    register: UntypedFormGroup;
    addForm: UntypedFormGroup;
    editForm: UntypedFormGroup;
    field: any;
    dataPipe: any;
    data: any[];
    form: FormGroup;
    dataDS: any[];
    dataGameType= dataGameType;

    constructor(
        private fb: UntypedFormBuilder,
        private _snackBar: MatSnackBar,
        private modalService: NgbModal,
        private service: GameService,
    ) {}

    ngOnInit(): void {
        this.relativeDataFromDS();
        this.fetchDataFromApis();
        this.addForm = this.fb.group({
        id: [""],
        game_name: ["", Validators.required],
        game_type: ["", Validators.required],
        subject_id: ["", Validators.required],
        });

        this.editForm = this.fb.group({
        id: [""],
        game_name: ["", Validators.required],
        game_type: ["", Validators.required],
        subject_id: ["", Validators.required],
        });
    }
    relativeDataFromDS() {
        this.service.getDataDS().subscribe((response: any) => {
            this.dataDS = response.subjects;
        });
    }

    fetchDataFromApis() {
        this.service.getData().subscribe((response: any) => {
            this.data = response.games;
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
        game_name: form.value.game_name,
        game_type: form.value.game_type,
        subject_id: form.value.subject_id,
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
        game_name: item.game_name,
        game_type: item.game_type,
        subject_id: item.subject_id,
        });
        this.selectedRowData = item;
    }

    onEditSave(form: UntypedFormGroup) {
        const updatedData = {
        game_name: form.value.game_name,
        game_type: form.value.game_type,
        subject_id: form.value.subject_id,
        };
        this.service.updateOneData(form.value.id, updatedData).subscribe((response) => {
            const rowIndex = this.data.findIndex((item) => item.id === form.value.id);
            if (rowIndex !== -1) {
            this.data[rowIndex].game_name = form.value.game_name;
            this.data[rowIndex].game_type = form.value.game_type;
            this.data[rowIndex].subject_id = form.value.subject_id;
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
}
export interface selectRowInterface {
    sr: String;
    game_name: String;
    game_type: String;
    subject_id: Number;
}
