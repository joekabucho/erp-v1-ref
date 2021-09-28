import { Component, OnDestroy, TemplateRef, OnInit } from '@angular/core';
import { NbDialogService, NbToastrService, NbComponentStatus } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationService } from '../../@core/services/organization.service';
import { UserService } from '../../@core/services/user.service';

@Component({
  selector: 'ngx-division',
  templateUrl: './division.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class DivisionComponent implements OnInit, OnDestroy {

  alive = true;
  submitted = false;
  companies = [];
  divisions = [];
  hod = [];

  constructor(
    private dialogService: NbDialogService,
    private orgService: OrganizationService,
    private userService: UserService,
    private toastr: NbToastrService,
  ) { }

  ngOnInit() {
    this.orgService.refresh$.subscribe(
      () => {
        this.getCompanies();
        this.getDivisions();
      },
    );
    this.getUsers();
    this.getCompanies();
    this.getDivisions();
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.hod = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'ADMIN';
          }
        });
      });
  }

  getCompanies() {
    this.orgService.fetchCompany()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.companies = data.results;
        },
      );
  }

  showCompForm(dialog0: TemplateRef<any>) {
    this.dialogService.open(dialog0, { context: 'this is some additional data passed to dialog' });
  }

  saveCompany(compForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-comp');

    this.submitted = true;

    formData.append('name', compForm.name);

    this.orgService.createCompany(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a company', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  getDivisions() {
    this.orgService.fetchDivision()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.divisions = data.results;
        },
      );
  }

  showDivForm(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  saveDivision(divForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-div');

    this.submitted = true;

    formData.append('name', divForm.name);
    formData.append('company', divForm.company);
    // formData.append('HOD', divForm.hod);

    this.orgService.createDivision(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a division', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}


@Component({
  selector: 'ngx-department',
  templateUrl: './department.component.html',
  styleUrls: ['./organization.component.scss'],
})

export class DepartmentComponent implements OnInit, OnDestroy {

  alive = true;
  submitted = false;
  divisions = [];
  departments = [];
  teams = [];
  selectedTeams = [];
  isChecked;

  constructor(
    private dialogService: NbDialogService,
    private orgService: OrganizationService,
    private toastr: NbToastrService,
  ) {
  }

  ngOnInit() {
    this.orgService.refresh$.subscribe(
      () => {
        this.getDepartments();
        this.getTeams();
      },
    );
    this.getDivisions();
    this.getDepartments();
    this.getTeams();
  }

  getDivisions() {
    this.orgService.fetchDivision()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.divisions = data.results;
        },
      );
  }

  getDepartments() {
    this.orgService.fetchDepartment()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.departments = data.results;
        },
      );
  }

  getTeams() {
    this.orgService.fetchTeam()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.teams = data.results;
        },
      );
  }

  changed(evt, team) {
    this.isChecked = evt.target.checked;

    if (this.isChecked) {
      this.selectedTeams.push(team.id);
    } else {
      this.selectedTeams = this.selectedTeams.filter(i => {
        return i !== team.id;
      });
    }
  }

  saveDepartment(deptForm) {
    const payload = {
      'name': deptForm.name,
      'division': deptForm.division,
      'teams': this.selectedTeams,
    };
    this.submitted = true;
    const modalCloseBtn = document.getElementById('close-dept');

    this.orgService.createDepartment(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a department', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );

  }

  saveTeam(teamForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-team');
    this.submitted = true;

    formData.append('name', teamForm.name);

    this.orgService.createTeam(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();

          this.showToast('You have successfully added a team', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  showDepForm(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  showTeamForm(dialog2: TemplateRef<any>) {
    this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
