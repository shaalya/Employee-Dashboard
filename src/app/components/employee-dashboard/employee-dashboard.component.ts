import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DialogComponent } from 'src/app/dialog/dialog/dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { EmployeeDashboardModel } from './employee-dashboard.model';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  searchQuery: any = '';
  searchQuery$$ = new BehaviorSubject<string>('');

  sortByAsc: boolean = true;
  form = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    designation: new FormControl(),
    joining_date: new FormControl(),
  });
  employeeModelObj: EmployeeDashboardModel = new EmployeeDashboardModel();
  employeeDetails: any;
  update = false;
  employeeIds: any;
  tblrow: any;
  dataToEdit: any;
  username: any;

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.username = this.router.getCurrentNavigation()?.extras?.state?.username;
  }

  ngOnInit(): void {
    this.getAllEmployee();
  }

  search() {
    this.searchQuery$$.next(this.searchQuery);
  }

  getAllEmployee() {
    this.api.getEmployee().subscribe((res: any) => {
      this.employeeDetails = res;
    });
  }

  editEmployee(data: any) {
    this.update = true;
    this.dataToEdit = data;
    this.employeeModelObj.id = data.id;
  }

  sortData(sort: any) {
    const data = this.employeeDetails.slice();
    if (!sort.active || sort.direction === '') {
      this.employeeDetails = data;
      return;
    }

    this.employeeDetails = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(a.id, b.id, isAsc);
        case 'designation':
          return compare(a.designation, b.designation, isAsc);
        case 'joining_date':
          return compare(a.joining_date, b.joining_date, isAsc);
        default:
          return 0;
      }
    });
  }

  openDialog(id?: any, isDelete?: boolean) {
    this.dialog
      .open(DialogComponent, {
        data: {
          formData: this.dataToEdit,
          isUpdate: this.update,
          employeeId: id,
          isDelete: isDelete,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        this.getAllEmployee();
      });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}