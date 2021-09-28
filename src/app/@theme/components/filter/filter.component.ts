import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ShareDataService } from '../../../@core/services/shared-data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../../@core/services/user.service';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'ngx-filter',
  styleUrls: ['./filter.component.scss'],
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  ticket: any;
  department: any;
  currentRoute: any;

  filterForm: FormGroup;
  alive = true;
  technicans = [];
  safetyOfficers = [];

  constructor(
    private router: Router,
    private shared: ShareDataService,
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      'technician': [],
      'safety_officer': [],
      'department': [],
      'start_date': [],
      'end_date': [],
      'status': [],
      'year': [],
    });
    this.getAllUsers();
  }


  openNav() {
    document.getElementById('mySidenav').style.width = '310px';
    document.getElementById('main').style.marginRight = '310px';
    this.currentRoute = this.router.url.toString();
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginRight = '0';
  }

  fetchData() {
    this.shared.changeValue(JSON.stringify(this.filterForm.value));
    this.filterForm.reset();
  }


  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.safetyOfficers = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.technicans = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN';
          }
        });
      });
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
