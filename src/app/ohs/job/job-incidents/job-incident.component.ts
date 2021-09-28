import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { IncidentsService } from '../../../@core/services/incident.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserService } from '../../../@core/services/user.service';
import { DatePipe } from '@angular/common';
import { JobIncidents } from '../../../@core/models/incidents';
import * as jwt_decode from 'jwt-decode';
import { IncidentPageEditComponent } from '../../report-pages/incident-edit/incident-edit.component';
import { ModalController } from '@ionic/angular';
import { ShareDataService } from '../../../@core/services/shared-data.service';


@Component({
  selector: 'ngx-job-incident',
  styleUrls: ['./job-incident.component.scss'],
  templateUrl: './job-incident.component.html',
})
export class JobIncidentComponent implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;


  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordTeamLead = 'first_name';
  keywordLoc = 'name';
  keywordDep = 'name';

  Incidents = [];
  Tickets = [];
  teamleads = [];
  safetyWorker = [];
  allUsers = [];
  Locations = [];
  Departments = [];
  Date;
  alive = true;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  checked = false;
  public selectedDep: any;

  toggle(checked: boolean) {
    this.checked = checked;
  }
  submitted = false;
  post: any;
  selectedChecklist;

  public addActivity;
  public addControl;
  public addHazardControl;

  incidentEditForm: FormGroup;
  public selectedTicket: any;
  public selectedSO: any;
  public selectedLoc: any;
  public selectedTeam: any;

  headElements = [
    '', 'ID', 'TEAM LEAD', 'TICKET', 'NAME OF WORKER', 'DEPARTMENT', 'DESCRIPTION',
    'GENDER', 'TIME', 'DATE OF INCIDENT', 'INJURY TO WORKER', 'OCCUPATION', 'LOCATION OF INCIDENT', 'EQUIPMENT DAMAGE', 'NAME OF PERSON REPORTING INCIDENT', 'PRIMARY WITNESS', 'SECONDARY WITNESS', 'IMMEDIATE ACTION TAKEN', 'POST INCIDENT ACTION', 'VICTIM TAKEN TO', 'REPORT SENT BY', 'REPORT SENT TO', 'LTA', 'LTI', 'NON-LTI', 'EDIT', 'DELETE',
  ];
  male = 'male';
  female = 'female';
  other = 'other';
  none = 'none';
  searchItem: any;

  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  currentUrl: any;
  public unSubscribe = new Subject();

  constructor(
    private dialogService: NbDialogService,
    public incidentsService: IncidentsService,
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private userService: UserService,
    private datePipe: DatePipe,
    public modalCtrl: ModalController,
    private _http: HttpClient,
    private shared: ShareDataService,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.incidentsService.refresh$.subscribe(
      () => {
        this.loadIncidents(this.itemsPerPage);
      },
    );
    this.loadIncidents(this.itemsPerPage);
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      colReorder: true,
      pageLength: this.itemsPerPage,
      dom: 'Brt',
      columnDefs: [
        {
          searchPanes: {
            show: true,
          },
          targets: [1, 2, 3, 11, 19, 20],
          checkboxes: {
            'selectRow': true,
          },
        },
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
        },
      ],
      select: {
        style: 'multi',
        selector: 'td:first-child',
      },
      order: [[1, 'asc']],

      buttons: [
        {
          extend: 'excel', className: 'btn btn-outline-success ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
        },
        {
          extend: 'pdf', className: 'btn btn-outline-danger ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
        },
        {
          extend: 'csv', className: 'btn btn-outline-info ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
        },
        {
          extend: 'copy', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
        },
        {
          extend: 'print', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
          },
        },
        { extend: 'colvis', className: 'btn btn-outline-secondary ml-2' },
        { extend: 'searchPanes', className: 'btn btn-outline-secondary ml-2' },
        { extend: 'selectAll', className: 'btn btn-outline-secondary ml-2' },
        { extend: 'selectNone', className: 'btn btn-outline-secondary ml-2' },

      ],
    };
    this.shared.currentFilter.pipe(takeUntil(this.unSubscribe))
      .subscribe(message => {
        if (message === 'default') {
          return;
        } else {
          this.filterInfo = JSON.parse(message);
          if (this.filterInfo.year !== null) {
            // this.yearFilter(this.itemsPerPage, this.filterInfo.year);
          }
        }
      });

    this.shared.currentData.pipe(takeUntil(this.unSubscribe))
      .subscribe(info => {
        if (info === 'next') {
          this.pageChangedNext();
        } else if (info === 'previous') {
          this.pageChangedPrevious();
        } else {
          return;
        }
      });

    this.shared.currentSearch.pipe(takeUntil(this.unSubscribe))
      .subscribe(term => {
        if (term === 'search') {
          return;
        } else {
          this.searchDetails(term);
        }
      });

    this.shared.currentSelect.pipe(takeUntil(this.unSubscribe))
      .subscribe(select => {
        if (select === 0) {
          return;
        } else {
          this.itemsPerPage = select;
          if (select === 'all') {
            this.dtOptions.pageLength = 1000000;
          } else {
            this.dtOptions.pageLength = select;
          }
          this.loadIncidents(this.itemsPerPage);
        }
      });
    this.transformDate();
    this.incidentEditForm = this.fb.group({
      'team_lead': [null, Validators.required],
      'ticket': [null, Validators.required],
      'name_of_worker': [null, Validators.required],
      'department': [null, Validators.required],
      'description': [null, Validators.required],
      'gender': [null, Validators.required],
      'time': [null, Validators.required],
      'date_of_incident': [null, Validators.required],
      'injury_to_worker': [null, Validators.required],
      'occupation': [null, Validators.required],
      'location_of_incident': [null, Validators.required],
      'equipment_damage': [null, Validators.required],
      'name_of_person_reporting_incident': [null, Validators.required],
      'primary_witness': [null, Validators.required],
      'secondary_witness': [null, Validators.required],
      'immediate_action_taken': [null, Validators.required],
      'post_incident_action': [null, Validators.required],
      'victim_taken_to': [null, Validators.required],
      'report_sent_to': [null, Validators.required],
      'lta': [null, Validators.required],
      'lti': [null, Validators.required],
      'non_lti': [null],
    });
  }

  selectedTicketID(item) {
    // do something with selected item
    this.selectedTicket = item.id;
  }
  selectSO(item) {
    // do something with selected item
    this.selectedSO = item.id;
  }
  selectTeam(item) {
    // do something with selected item
    this.selectedTeam = item.id;
  }
  selectLoc(item) {
    // do something with selected item
    this.selectedLoc = item.id;
  }
  selectDep(item) {
    // do something with selected item
    this.selectedDep = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedLoc(e) {
    // do something when input is focused
    this.loadLocations();
  }
  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSo(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedTeam(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  onFocusedDepartment(e) {
    // do something when input is focused
    this.loadDepts();
  }
  transformDate() {
    this.Date = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  loadIncidents(num) {
    return this.incidentsService.fetchIncidents(num).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Incidents = data.results;
        this.nextPage = data.next;
        this.previousPage = data.previous;
        this.totalCount = data.count;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        } else {
          this.isDtInitialized = true;
          this.dtTrigger.next();
        }
      });
  }



  searchDetails(searchTerm) {
    this.incidentsService.searchIncidents(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Incidents = data.results;
          if (this.isDtInitialized) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.isDtInitialized = true;
            this.dtTrigger.next();
          }
        },
      );
  }



  pageChangedNext() {
    if (this.nextPage === null) {
      this.showToast('This is the last page', 'success');
    } else {
      this._http.get<any>(`${this.nextPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.Incidents = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;
            if (this.isDtInitialized) {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
              });
            } else {
              this.isDtInitialized = true;
              this.dtTrigger.next();
            }
          },
        );
    }
  }

  pageChangedPrevious() {
    if (this.previousPage === null) {
      this.showToast('No previous pages', 'warning');
    } else {
      this._http.get<any>(`${this.previousPage}`)
        .pipe(takeWhile(() => this.alive))
        .subscribe(
          data => {
            this.Incidents = data.results;
            this.nextPage = data.next;
            this.previousPage = data.previous;

            if (this.isDtInitialized) {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next();
              });
            } else {
              this.isDtInitialized = true;
              this.dtTrigger.next();
            }
          },
        );
    }
  }

  // yearFilter(items, year) {
  //   this.WorkPermitService.filterByYear(items, year)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(
  //       data => {
  //         this.WorkPermits = data.results;
  //         if (this.isDtInitialized) {
  //           this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //             dtInstance.destroy();
  //             this.dtTrigger.next();
  //           });
  //         } else {
  //           this.isDtInitialized = true;
  //           this.dtTrigger.next();
  //         }
  //       },
  //     );
  // }


  // onChange(event: any) {
  //   this.itemsPerPage = event;
  //   this.dtOptions.pageLength = event;
  //   this.loadIncidents(null);
  // }

  loadLocations() {
    return this.incidentsService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }

  loadDepts() {
    return this.incidentsService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Departments = data.results;
      });
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.allUsers = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN' || 'SAFETY OFFICER' || 'TEAM LEAD';
          }
        });
        this.safetyWorker = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.teamleads = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TEAM LEAD';
          }
        });
      });
  }

  DeleteToolboxTalks(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.incidentsService.deleteIncidents(id).subscribe(data => {
        this.loadIncidents(null);
      });
    }
  }
  editIncidents() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'team_lead': this.selectedTeam,
      'ticket': this.selectedTicket,
      'name_of_worker': this.incidentEditForm.get('name_of_worker').value,
      'department': this.selectedDep,
      'description': this.incidentEditForm.get('description').value,
      'gender': this.incidentEditForm.get('gender').value,
      'time': this.incidentEditForm.get('time').value,
      'date_of_incident': this.incidentEditForm.get('date_of_incident').value,
      'injury_to_worker': this.incidentEditForm.get('injury_to_worker').value,
      'occupation': this.incidentEditForm.get('occupation').value,
      'location_of_incident': this.selectedLoc,
      'equipment_damage': this.incidentEditForm.get('equipment_damage').value,
      'name_of_person_reporting_incident': this.incidentEditForm.get('name_of_person_reporting_incident').value,
      'primary_witness': this.incidentEditForm.get('primary_witness').value,
      'secondary_witness': this.incidentEditForm.get('secondary_witness').value,
      'immediate_action_taken': this.incidentEditForm.get('immediate_action_taken').value,
      'post_incident_action': this.incidentEditForm.get('post_incident_action').value,
      'victim_taken_to': this.incidentEditForm.get('victim_taken_to').value,
      'report_sent_by': this.loggedInUser.id,
      'report_sent_to': this.selectedSO,
      'lta': this.incidentEditForm.get('lta').value,
      'lti': this.incidentEditForm.get('lti').value,
      'non_lti': this.incidentEditForm.get('non_lti').value,



    };
    this.selectedChecklist = localStorage.getItem('selectedIncidentChecklist');
    this.incidentsService.editIncidents(this.selectedChecklist, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Job Incident', 'success');
          this.loadIncidents(null);
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Job Incident', 'danger');
        },
      );
  }

  loadTickets() {
    return this.incidentsService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }

  open(dialog: TemplateRef<any>, incident) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.changeJobIncident(incident);
  }



  changeJobIncident(incident: JobIncidents) {
    this.incidentEditForm.patchValue({
      'team_lead': incident.team_lead === null ? '' : incident.team_lead.id,
      'ticket': incident.ticket === null ? '' : incident.ticket.id,
      'name_of_worker': incident.name_of_worker,
      'department': incident.department === null ? '' : incident.department.id,
      'description': incident.description,
      'gender': incident.gender,
      'time': incident.time,
      'date_of_incident': incident.date_of_incident,
      'injury_to_worker': incident.injury_to_worker,
      'occupation': incident.occupation,
      'location_of_incident': incident.location_of_incident === null ? '' : incident.location_of_incident.id,
      'equipment_damage': incident.equipment_damage,
      'name_of_person_reporting_incident': incident.name_of_person_reporting_incident,
      'primary_witness': incident.primary_witness,
      'secondary_witness': incident.secondary_witness,
      'immediate_action_taken': incident.immediate_action_taken,
      'post_incident_action': incident.post_incident_action,
      'victim_taken_to': incident.victim_taken_to,
      'report_sent_by': incident.report_sent_by === null ? '' : incident.report_sent_by.id,
      'report_sent_to': incident.report_sent_to === null ? '' : incident.report_sent_to.id,
      'lta': incident.lta,
      'lti': incident.lti,
      'non_lti': incident.non_lti,
    });
  }

  selectedToolboxChecklist(id) {
    localStorage.setItem('selectedIncidentChecklist', id);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: IncidentPageEditComponent,
    });
    localStorage.setItem('incident', id);
    return await modal.present();
  }

  identify(index, item) {
    return item.id;
  }

}
