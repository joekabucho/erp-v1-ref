import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProjectService } from '../../@core/services/project.service';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
import { OrganizationService } from '../../@core/services/organization.service';
import * as jwt_decode from 'jwt-decode';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../../@core/models/project';
import { KpiService} from '../../@core/services/kpi.service';


@Component({
  selector: 'ngx-project-detail',
  styleUrls: ['./project.component.scss'],
  templateUrl: './project.component.html',
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  projectManager = [];
  divisions = [];
  projects = [];
  clients = [];
  services = [];
  kpis: string;
  kpisalldata = [];
  submitted = false;
  searchTerm: any;
  userDetails: any;
  noImage = null;
  projectStatus: number;
  dateStarted: any;
  projectDateCompleted: any;
  lastSelected: any;
  item: any;
  projectEditForm: FormGroup;
  selectedProject: any;


  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private orgService: OrganizationService,
    private dialogService: NbDialogService,
    private toastr: NbToastrService,
    private router: Router,
    protected location: Location,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private kpiService: KpiService,


  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.projectStatus = +this.route.snapshot.paramMap.get('id');
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
  }

  ngOnInit() {
    this.projectService.refresh$.subscribe(
      () => {
        this.getProjects();
        this.getClients();
        this.getServices();
      },
    );
    this.kpiService.refresh$.subscribe(
      () => {
        this.getServiceKPIs();
      },
    );
    this.transformDate();
    this.projectEditForm = this.fb.group({
      name: ['', Validators.required],
      manager: ['', Validators.required],
      client: ['', Validators.required],
      expected_income: ['', Validators.required],
      project_type: ['', Validators.required],
      service: ['', Validators.required],
      kpi: ['', Validators.required],
    });
    this.getProjects();
  }

  transformDate() {
    this.dateStarted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
    this.projectDateCompleted = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }


  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.projectManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
      });
  }

  getUserProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.userDetails = data;
      });
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

  getProjects() {
    let allProjects = [];
    const dateNow = new Date();

    this.projectService.fetchProject()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          allProjects = data.results;

          if (this.projectStatus === 1) {
            if (this.loggedInUser.role === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
              this.projects = allProjects.filter(p => {
                return p.date_started === null;
              });
            } else {
              this.projects = allProjects.filter(p => {
                return this.loggedInUser.division === p.project_type.name && p.date_started === null;
              });
            }


          } else if (this.projectStatus === 2) {
            if (this.loggedInUser.role === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.due_date = this.calcEndDate(p.date_started, p.kpi.number_of_days);
                p.now = dateNow.getTime();
                return p.date_started !== null && p.close_date === null && p.due_date > p.now;
              });
            } else {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.due_date = this.calcEndDate(p.date_started, p.kpi.number_of_days);
                p.now = dateNow.getTime();
                // tslint:disable-next-line: max-line-length
                return this.loggedInUser.division === p.project_type.name && p.date_started !== null && p.close_date === null && p.due_date > p.now;
              });
            }


          } else if (this.projectStatus === 3) {
            if (this.loggedInUser.role === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.due_date = this.calcEndDate(p.date_started, p.kpi.number_of_days);
                p.now = dateNow.getTime();
                return p.date_started !== null && p.due_date < p.now && p.close_date === null;
              });

            } else {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.due_date = this.calcEndDate(p.date_started, p.kpi.number_of_days);
                p.now = dateNow.getTime();
                // tslint:disable-next-line: max-line-length
                return this.loggedInUser.division === p.project_type.name && p.date_started !== null && p.due_date < p.now && p.close_date === null;
              });
            }
          } else {
            if (this.loggedInUser.role === 'SUPERUSER' || this.loggedInUser.role_name === 'SUPERADMIN') {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.completedOn = this.calcDaysTaken(p.date_started, p.close_date);
                return p.close_date !== null;
              });
            } else {
              this.projects = allProjects.filter(p => {
                p.days = this.calcDaysDiff(p.date_started);
                p.completedOn = this.calcDaysTaken(p.date_started, p.close_date);
                return this.loggedInUser.division === p.project_type.name && p.close_date !== null;
              });
            }
          }
        },
      );
  }

  getClients() {
    this.projectService.fetchClient()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.clients = data.results;
        },
      );
  }

  getServices() {
    this.projectService.fetchService()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.services = data.results;
        },
      );
  }

  getServiceKPIs() {
    let allkpis = [];

    this.kpiService.fetchServiceKPI()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.kpis = data.results;
          allkpis = data.results;
          this.kpisalldata = allkpis.filter(
            kpi => JSON.stringify(kpi.service.id) === localStorage.getItem('selectedOption'),
          );
        },
      );
  }

  saveProject(projectForm) {
    const formData = new FormData;
    const modalCloseBtn = document.getElementById('close-prj');
    this.submitted = true;

    formData.append('name', projectForm.name);
    formData.append('client', projectForm.client);
    formData.append('service', projectForm.service);
    formData.append('expected_income', projectForm.expected_income);
    formData.append('manager', projectForm.manager);
    formData.append('project_type', projectForm.project_type);
    formData.append('kpi', projectForm.kpi);
    formData.append('created_by', this.loggedInUser.id);

    this.projectService.createProject(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.router.navigate([`/operations/projects/1`]);
          this.showToast('You have successfully added a project', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to add the project. Double check the form and correct the details', 'danger');
        },
      );
  }

  startProject(project) {
    const payload = {
      'date_started': this.dateStarted,
    };
    this.projectService.editProject(project.id, payload)
      .subscribe(
        () => {
          this.showToast('Operation successful. The project is now in progress', 'success');
          this.router.navigate([`/operations/sites/${project.id}`]);
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to start project', 'danger');
        },
      );
  }


  endProject() {
    const modalCloseBtn = document.getElementById('close-edit');
    const payload = {
      'close_date': this.projectDateCompleted,
    };
    this.projectService.editProject(this.selectedProject.id, payload)
      .subscribe(
        () => {
          this.showToast('You have successfully Ended the Project', 'success');
          this.router.navigate([`/operations/projects/4`]);
          modalCloseBtn.click();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to End Project', 'danger');
        },
      );
  }

  confirmDelete(project) {
    const x = confirm('Are you sure you want to remove this Project?');
    if (x) {
      this.removeProject(project);
    } else {
      return false;
    }
  }


  removeProject(project) {
    this.projectService.deleteProject(project.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Removed the Project`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  editProject() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'name': this.projectEditForm.get('name').value,
      'manager': this.projectEditForm.get('manager').value,
      'service': this.projectEditForm.get('service').value,
      'client': this.projectEditForm.get('client').value,
      'project_type': this.projectEditForm.get('project_type').value,
      'expected_income': this.projectEditForm.get('expected_income').value,
      'kpi': this.projectEditForm.get('kpi').value,
    };

    this.projectService.editProject(this.selectedProject.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Project', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Project', 'danger');
        },
      );
  }

  saveClient(clientForm) {
    const payload = {
      'name': clientForm.name,
    };
    this.submitted = true;
    const modalCloseBtn = document.getElementById('close-client');

    this.projectService.createClient(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a client', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  saveService(serviceForm) {
    const payload = {
      'name': serviceForm.name,
      'kpi': serviceForm.kpi,
    };
    this.submitted = true;
    const modalCloseBtn = document.getElementById('close-service');
    this.projectService.createService(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a Service', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  savekpi(kpiForm) {
    this.submitted = true;

    const payload = {
      'name': kpiForm.name,
      'number_of_days': kpiForm.number_of_days,
      'service': kpiForm.service,
    };

    this.kpiService.createKPI(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added a KPI', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }

  saveServiceKPI(kpiServiceForm) {
    this.submitted = true;
    const payload = {
      'service': kpiServiceForm.service,
      'name': kpiServiceForm.name,
      'number_of_days': kpiServiceForm.number_of_days,
    };
    const modalCloseBtn = document.getElementById('close-kpi');

    this.kpiService.createKPI(payload)
    .subscribe(
      () => {
        this.submitted = false;
        modalCloseBtn.click();
        this.showToast('You have successfully added a KPI to a service', 'success');
      },
      (error: HttpErrorResponse) => {
        this.submitted = false;
        modalCloseBtn.click();
        this.showToast('Error', 'danger');
      },
    );
  }

  calcDaysDiff(dateStarted) {
    const date1: any = new Date(dateStarted);
    const date2: any = new Date;
    const diffInDays = Math.abs(Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)));
    return diffInDays;
  }

  calcEndDate(dateStarted, expectedDays) {
    const date1: any = new Date(dateStarted);
    const end_date = date1.setDate(date1.getDate() + expectedDays);
    return end_date;
  }

  calcDaysTaken(dateStarted, dateEnded) {
    const date1: any = new Date(dateStarted);
    const date2: any = new Date(dateEnded);
    const diffInDays = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24)); // milliseconds * seconds * minutes * hours
    return diffInDays;
  }

  openProject(dialog: TemplateRef<any>) {
    this.getClients();
    this.getServices();
    this.getAllUsers();
    this.getDivisions();
    this.getServiceKPIs();
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  editProjectForm(project, dialog3: TemplateRef<any>) {
    this.getClients();
    this.getServices();
    this.getAllUsers();
    this.getDivisions();
    this.getServiceKPIs();
    this.selectedProject = project;

    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 3000);
    this.changeProject(project);
  }

  changeProject(project: Project) {
    this.projectEditForm.patchValue({
      name: project.name,
      manager: project.manager.id,
      service: project.service.id,
      client: project.client.id,
      expected_income: project.expected_income,
      project_type: project.project_type.id,
      kpi: project.kpi.id,
    });
  }


  openClient(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  openService(dialog2: TemplateRef<any>) {
    this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    this.getServiceKPIs();
    this.getServices();
    this.getServiceKPIs();
  }

  openKPI(dialog4: TemplateRef<any>) {
    this.dialogService.open(dialog4, { context: 'this is some additional data passed to dialog' });
    this.getServices();
  }

  back() {
    this.location.back();
    return false;
  }

  viewDetails(project) {
    if (project.date_started === null) {
      this.showToast('Click start project to begin works', 'warning');
    } else {
      this.router.navigate([`/operations/sites/${project.id}`]);
    }
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  changedItem(service) {
    const serviceInt = parseInt(service, 10);
    localStorage.setItem('selectedOption', JSON.stringify(serviceInt));
    this.getServiceKPIs();
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
