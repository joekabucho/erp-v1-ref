import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { InductionService } from '../../@core/services/induction.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
import { DatePipe } from '@angular/common';
import {SafetyInduction} from '../../@core/models/induction';
import * as jwt_decode from 'jwt-decode';
import {InductionPageEditComponent} from '../report-pages/induction-edit/induction-edit.component';
import { ModalController} from '@ionic/angular';
import { ShareDataService } from '../../@core/services/shared-data.service';


@Component({
  selector: 'ngx-safetyinductions',
  templateUrl: './safetyinductions.component.html',
  styleUrls: ['./safetyinductions.component.scss'],
})
export class SafetyinductionsComponent implements OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;
  Inductionchecklist = [];
  attendants = [];
  allattendants = [];
  Locations = [];
  Tickets = [];
  Users = [];
  technician = [];
  safetyOfficer = [];
  teamLead = [];
  Date;
  filter = false;

  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordTeamLead = 'first_name';
  keywordLoc = 'name';

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  alive = true;
  submitted = false;
  post: any;
  selectedChecklist;

  public addActivity;
  public addControl;
  public addHazardControl;

  approver ;
  requester ;
  approval_item ;
  comment ;
  status ;

  filteredAttendants = [];
  selectedAttendants = [];
  unselectedAttendants = [];
  selectedEditAttendants = [];

  searchItem: any;


  inductionEditForm: FormGroup;
  headElements = [
    '', 'ID', 'DATE', 'TIME', 'JOB/TICKET', 'LOCATION', 'ACTIVITY', 'TEAM LEADER', 'SAFETY OFFICER', 'ATTENDANTS',
    'DONE BY', 'EDIT', 'DELETE',
  ];
  private attendantsForm: FormGroup;
  private isChecked: any;
  private attendantsToInject: any;

  public selectedTicket: any;
  public selectedSO: any;
  public selectedLoc: any;
  public selectedTeam: any;


  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  currentUrl: any;
  public unSubscribe = new Subject();

  constructor(
    private dialogService: NbDialogService,
    public InductionChecklistService: InductionService,
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
    this.InductionChecklistService.refresh$.subscribe(
      () => {
        this.loadInductionchecklists(this.itemsPerPage);
      },
    );
    this.loadInductionchecklists(this.itemsPerPage);
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
          targets: [2, 3, 5, 6],
        },
        {
          orderable: false,
          className: 'select-checkbox',
          targets:   0,
          checkboxes: {
            'selectRow': true,
          },
        },
        {
          orderable: false,
          className: 'select-checkbox',
          targets:   0,
        },
      ],
      select: {
        style:    'multi',
        selector: 'td:first-child',
      },
      order: [[ 1, 'asc' ]],
      buttons: [
        {
          extend: 'excel', className: 'btn btn-outline-success ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          extend: 'pdf', className: 'btn btn-outline-danger ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          extend: 'csv', className: 'btn btn-outline-info ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          extend: 'copy', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          extend: 'print', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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
          this.loadInductionchecklists(this.itemsPerPage);
        }
      });

    this.transformDate();
    this.inductionEditForm = this.fb.group({
      'date': this.Date,
      'ticket': ['', Validators.required],
      'activity': ['', Validators.required],
      'location': ['', Validators.required],
      'team_lead': ['', Validators.required],
      'safety_officer': ['', Validators.required],
      'done_by': ['', Validators.required],
      'attendants': this.allattendants,
    });
    this.attendantsForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
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
  transformDate() {
    this.Date = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }
  // Get safety induction  list
  loadInductionchecklists(num) {
    return this.InductionChecklistService.fetchSafetyInductions(num).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Inductionchecklist = data.results;
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
    this.InductionChecklistService.searchSafetyInduction(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Inductionchecklist = data.results;
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
            this.Inductionchecklist = data.results;
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
            this.Inductionchecklist = data.results;
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
  loadLocations() {
    return this.InductionChecklistService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }
  loadTickets() {
    return this.InductionChecklistService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }

  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: InductionPageEditComponent,
    });
    localStorage.setItem('induction', id);
    return await modal.present();
  }
  // fetchDetails() {
  //   this.InductionChecklistService.searchSafetyInduction(this.searchItem)
  //   .pipe(takeWhile(() => this.alive))
  //   .subscribe(
  //     data => {
  //       this.Inductionchecklist = data.results;
  //       if (this.isDtInitialized) {
  //         this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //           dtInstance.destroy();
  //           this.dtTrigger.next();
  //         });
  //       } else {
  //         this.isDtInitialized = true;
  //         this.dtTrigger.next();
  //       }
  //     },
  //   );
  // }


  // onChange(event: any) {
  //   this.itemsPerPage = event;
  //   this.dtOptions.pageLength = event;
  //   this.loadInductionchecklists();
  // }

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Users = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN';
          }
        });
        this.technician = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN' || 'SAFETY OFFICER' || 'TEAM LEAD';
          }
        });
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.teamLead = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TEAM LEAD';
          }
        });
      });
  }
  loadAttendants() {
    return this.InductionChecklistService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
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
    this.InductionChecklistService.createAttendants(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          this.loadInductionchecklists(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }
  // Delete induction checklist
  // tslint:disable-next-line:variable-name
  DeleteInductionChecklist(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.InductionChecklistService.deleteSafetyInductions(id).subscribe(data => {
        this.loadInductionchecklists(this.itemsPerPage);
      });
    }
  }
  editSafetyInduction() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.inductionEditForm.get('date').value,
      'ticket': this.selectedTicket,
      'activity': this.inductionEditForm.get('activity').value,
      'location': this.selectedLoc,
      'team_lead': this.selectedTeam,
      'safety_officer': this.selectedSO,
      'attendants': this.selectedEditAttendants,
      'done_by': this.inductionEditForm.get('done_by').value,

    };
    this.selectedChecklist = localStorage.getItem('selectedInductionChecklist');
    this.InductionChecklistService.editSafetyInductions(this.selectedChecklist, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Safety induction checklist', 'success');
          this.loadInductionchecklists(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Safety induction checklist', 'danger');
        },
      );
  }
  open(dialog: TemplateRef<any>, induction) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.changeSafetyInductions(induction);
  }
  changeSafetyInductions(induction: SafetyInduction) {
    this.inductionEditForm.patchValue({
      'date': this.datePipe.transform(induction.date, 'yyyy-MM-ddTHH:mm') ,
      'ticket': induction.ticket === null ? '' : induction.ticket.id,
      'activity': induction.activity,
      'location': induction.location === null ? '' : induction.location.id,
      'team_lead': induction.team_lead === null ? '' : induction.team_lead.id,
      'safety_officer': induction.safety_officer === null ? '' : induction.safety_officer.id,
      'done_by': induction.done_by,

    });
    this.attendantsForm = this.fb.group({
      'date': this.Date,
      'ticket': [null, Validators.required],
      'department': [null, Validators.required],
      'agenda': [null, Validators.required],
      'safety_officer': [null, Validators.required],
      'done_by': [null, Validators.required],
      'attendants': this.allattendants,
    });
    let i;
    for ( i = 0; i < induction.attendants.length; i++) {
      this.selectedAttendants[i] = induction.attendants[i].id;
    }
    const setAttendants = new Set(this.selectedAttendants);

    this.InductionChecklistService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.unselectedAttendants = data.results.filter(
          x => !setAttendants.has(x.id),
        );
        this.selectedAttendants = data.results.filter(
          x => setAttendants.has(x.id),
        );

      });

  }


  changed(evt, attend) {
    this.isChecked = evt.target.checked;

    if (this.isChecked) {
      let i;
      for (i = 0; i < this.selectedAttendants.length; i++) {
        this.attendantsToInject = this.selectedAttendants[i].id;
      }
      this.selectedEditAttendants.push(attend.id , this.attendantsToInject);
    } else {
      this.selectedEditAttendants = this.selectedEditAttendants.filter(t => {
        return t !== attend.id;
      });
    }
  }


  selectedInductionChecklist(id) {
    localStorage.setItem('selectedInductionChecklist', id);
  }

  openAttendants(dialog3: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 1000);  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }

  identify(index, item) {
    return item.id;
  }

}
