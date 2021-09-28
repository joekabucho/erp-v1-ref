import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService, NbComponentStatus } from '@nebular/theme';
import { HazardService } from '../../@core/services/hazard.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { UserService } from '../../@core/services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HazardAnalysis } from '../../@core/models/hazard-Analysis';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { JhaPageEditComponent } from '../report-pages/jha-edit/jha-edit.component';
import { ShareDataService } from '../../@core/services/shared-data.service';

@Component({
  selector: 'ngx-hazard-analysis',
  styleUrls: ['../job/job.component.scss'],
  templateUrl: './hazard-analysis.component.html',
})
export class HazardAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;
  alive = true;

  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';

  hazForm: FormGroup;
  hazEditForm: FormGroup;

  submitted: boolean;
  selectedHazard: any | undefined;



  headElements = [
    '', 'ID', 'DATE', 'TIME', 'TICKET', 'HAZARD', 'CONSEQUENCE', 'CONTROL', 'DESCRIPTION',
    'FIRE FIGHTER', 'FIRST AIDER', 'SUPERVISOR', 'TEAM MEMBERS', 'DONE BY', 'EDIT', 'DELETE',
  ];


  hazards = [];
  safetyOfficers = [];
  supervisors = [];
  allUsers = [];

  page: number = 1;
  // allItems: any;
  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  searchItem: any;

  jobHazards = [];

  Tickets = [];
  Attendees = [];
  private attendantsForm: FormGroup;
  public selectedTicket: any;
  public selectedSup: any;

  public unSubscribe = new Subject();



  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private hazardService: HazardService,
    private userService: UserService,
    private toastr: NbToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public modalCtrl: ModalController,
    private _http: HttpClient,
    private shared: ShareDataService,
    // private router: Router,
  ) {
    this.hazForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'ticket': [null, Validators.required],
      'description': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'done_by': [null, Validators.required],

    });

    this.hazEditForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'ticket': [null, Validators.required],
      'description': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'done_by': [null, Validators.required],

    });
    this.attendantsForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
    this.route.queryParams.subscribe(
      params => this.page = params['page'] ? params['page'] : 1,
    );
  }

  ngOnInit() {
    this.hazardService.refresh$.subscribe(
      () => {
        this.getHazards(this.itemsPerPage);
      },
    );
    this.getHazards(this.itemsPerPage);
    this.getAllUsers();
    this.getJobHazards();
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      colReorder: true,
      pageLength: this.itemsPerPage,
      // dom: 'Brtip',
      dom: 'Brt',
      columnDefs: [
        {
          searchPanes: {
            show: true,
          },
          targets: [2, 3, 7],
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
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
        {
          extend: 'pdf', className: 'btn btn-outline-danger ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
        {
          extend: 'csv', className: 'btn btn-outline-info ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
        {
          extend: 'copy', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        },
        {
          extend: 'print', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
          this.getHazards(this.itemsPerPage);
        }
      });
  }

  selectedTicketSup(item) {
    // do something with selected item
    this.selectedTicket = item.id;
  }
  selectSup(item) {
    // do something with selected item
    this.selectedSup = item.id;
  }

  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSup(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.allUsers = data.results;
        this.safetyOfficers = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.supervisors = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
      });
  }

  getJobHazards() {
    this.hazardService.fetchHazards(100)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobHazards = data.results;
        },
      );
  }

  getAttendees() {
    this.hazardService.fetchAttendees()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Attendees = data.results;
        },
      );
  }

  createAttendants() {
    const modalCloseBtn = document.getElementById('close-attendant');
    this.submitted = true;
    const payload = {
      'firstname': this.attendantsForm.get('firstname').value,
      'lastname': this.attendantsForm.get('lastname').value,
      'phone_number': this.attendantsForm.get('phone_number').value,
      'id_number': this.attendantsForm.get('id_number').value,
    };
    this.hazardService.createAttendants(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          // this.getHazards();
          this.getAttendees();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }

  getHazards(num) {
    this.hazardService.fetchHazardAnalysis(num)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazards = data.results;
          this.totalCount = data.count;
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


  searchDetails(searchTerm) {
    this.hazardService.searchHazardAnalysis(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazards = data.results;
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
            this.hazards = data.results;
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
            this.hazards = data.results;
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
  //   this.getHazards();
  // }

  // fetchDetails() {
  //   this.hazardService.searchHazards(this.searchItem)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(
  //       data => {
  //         this.hazards = data.results;
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

  loadTickets() {
    return this.hazardService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }
  editHazard() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'job_hazards': this.hazEditForm.get('job_hazards').value,
      'ticket': this.selectedTicket,
      'description': this.hazEditForm.get('description').value,
      'fire_fighter': this.hazEditForm.get('fire_fighter').value,
      'first_aider': this.hazEditForm.get('first_aider').value,
      'team_members': this.hazEditForm.get('team_members').value,
      'supervisor': this.selectedSup,
      'date': this.hazEditForm.get('date').value,
      'done_by': this.hazEditForm.get('done_by').value,

    };
    this.hazardService.editHazardAnalysis(this.selectedHazard.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully editted the Analysis', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Analysis', 'danger');
        },
      );

  }
  openHazEditform(dialog3: TemplateRef<any>, haz) {
    this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    this.selectedHazard = haz;
    this.changeHazard(haz);
  }

  changeHazard(haz: HazardAnalysis) {
    this.hazEditForm.patchValue({
      job_hazards: haz.job_hazards === null ? '' : haz.job_hazards.id,
      ticket: haz.ticket === null ? '' : haz.ticket.id,
      description: haz.description,
      fire_fighter: haz.fire_fighter,
      first_aider: haz.first_aider,
      team_members: haz.team_members === null ? '' : haz.team_members.id,
      supervisor: haz.supervisor,
      date: this.datePipe.transform(haz.date, 'yyyy-MM-ddTHH:mm'),
      done_by: haz.done_by,
    });
  }

  confirmDelete(haz) {
    const x = confirm('Are you sure you want to delete this Hazard Analysis?');
    if (x) {
      this.hazardService.deleteHazardAnalysis(haz.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Hazard Analysis`, 'success');
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            this.showToast('Operation unsuccessful', 'danger');
          },
        );
    } else {
      return false;
    }
  }

  openAttendants(dialog2: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }
  async showEdit(id) {
    localStorage.setItem('jha', id);
    const modal = await this.modalCtrl.create({
      component: JhaPageEditComponent,
    });
    return await modal.present();
  }


  identify(index, item) {
    return item.id;
  }

  ngOnDestroy() {
    this.alive = false;
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
