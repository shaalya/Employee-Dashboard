import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { EmployeeDashboardModel } from 'src/app/components/employee-dashboard/employee-dashboard.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    designation: new FormControl(),
    joining_date: new FormControl(),
  });

  update = false;
  employeeIds: any;

  employeeModelObj: EmployeeDashboardModel = new EmployeeDashboardModel();
  employeeDetails: any;
  formData: any;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formData = this.data.formData;
    if (this.formData) {
      this.form.patchValue({
        id: this.formData.id,
        name: this.formData.name,
        designation: this.formData.designation,
        joining_date: this.formData.joining_date,
      });
    }
  }

  postEmployeeDetails() {
    this.employeeModelObj = Object.assign({}, this.form.value);
    this.api.postEmployee(this.employeeModelObj).subscribe(
      (res: any) => {
        console.log(res);
        alert('Employee added successfully');
        this.close();
        this.form.reset();
      },
      (err) => {
        alert('Something went wrong ');
      }
    );
  }

  deleteEmployee() {
    console.log(this.data.employeeId);
    this.api.deleteEmployee(this.data.employeeId).subscribe((res) => {
      alert('Employee Deleted');
      this.close();
    });
  }

  editEmployee(data: any) {
    this.update = true;
    this.employeeModelObj.id = data.id;
    this.form.patchValue({
      id: data.id,
      name: data.name,
      designation: data.designation,
      joining_date: data.joining_date,
    });
  }

  updateEmployee() {
    this.employeeModelObj = Object.assign({}, this.form.value);
    this.api
      .updateEmployee(this.employeeModelObj, this.employeeModelObj.id)
      .subscribe((res: any) => {
        alert('Updated Successfully');
        this.close();
        this.form.reset();
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
