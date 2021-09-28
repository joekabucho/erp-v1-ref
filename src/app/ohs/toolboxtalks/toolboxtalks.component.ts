import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { ToolboxService } from '../../@core/services/toolbox.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
import { DatePipe } from '@angular/common';
import { ToolBoxTalks } from '../../@core/models/toolboxtalks';
import * as jwt_decode from 'jwt-decode';
import { ModalController } from '@ionic/angular';
import { TbtPageEditComponent } from '../report-pages/tbt-edit/tbt-edit.component';
import { ShareDataService } from '../../@core/services/shared-data.service';



@Component({
  selector: 'ngx-toolboxtalks',
  templateUrl: './toolboxtalks.component.html',
  styleUrls: ['./toolboxtalks.component.scss'],
})
export class ToolboxtalksComponent implements OnInit, OnDestroy {
  keywordTicket = 'ticket_code';
  keywordSO = 'first_name';
  keywordDep = 'name';



  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;

  ToolboxTalks = [];
  attendants = [];
  allattendants = [];
  Tickets = [];
  Locations = [];
  Departments = [];
  Date;
  alive = true;
  SafetyOfficer = [];
  filteredAttendants = [];
  selectedAttendants = [];
  unselectedAttendants = [];
  selectedEditAttendants = [];

  isChecked;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  submitted = false;
  post: any;
  selectedChecklist;

  public addActivity;


  approver;
  requester;
  comment;
  status;

  toolboxEditForm: FormGroup;
  headElements = [
    '', 'ID', 'DATE', 'TIME', 'REFERENCE', 'SAFETY OFFICER', 'TICKET', 'DEPARTMENT', 'AGENDA', 'ATTENDANCES',
    'DONE BY', 'EDIT', 'DELETE',
  ];
  public attendantsForm: FormGroup;
  public attendantsToInject: any;

  public historyHeading: string = 'Recently selected';

  searchItem: any;
  public selectedTicket: any;
  public selectedSO: any;
  public selectedDep: any;

  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  currentUrl: any;
  public unSubscribe = new Subject();




  constructor(
    private dialogService: NbDialogService,
    public ToolboxTalksService: ToolboxService,
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
    this.ToolboxTalksService.refresh$.subscribe(
      () => {
        this.loadToolboxTalks(this.itemsPerPage);
      },
    );
    this.loadToolboxTalks(this.itemsPerPage);
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
            show: false,
          },
          targets: [2, 4, 5],
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
          this.loadToolboxTalks(this.itemsPerPage);
        }
      });

    this.transformDate();
    this.toolboxEditForm = this.fb.group({
      'date': this.Date,
      'ticket': [null, Validators.required],
      'department': [null, Validators.required],
      'agenda': [null, Validators.required],
      'safety_officer': [null, Validators.required],
      'done_by': [null, Validators.required],
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
  selectDep(item) {
    // do something with selected item
    this.selectedDep = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedDepartment(e) {
    // do something when input is focused
    this.loadDepts();
  }
  onFocusedTickets(e) {
    // do something when input is focused
    this.loadTickets();
  }
  onFocusedSo(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  transformDate() {
    this.Date = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }
  loadToolboxTalks(num) {
    return this.ToolboxTalksService.fetchToolboxTalks(num).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.ToolboxTalks = data.results;
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
    this.ToolboxTalksService.searchToolbox(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ToolboxTalks = data.results;
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
            this.ToolboxTalks = data.results;
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
            this.ToolboxTalks = data.results;
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
  //   this.loadToolboxTalks();
  // }

  loadAttendants() {
    return this.ToolboxTalksService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  loadTickets() {
    return this.ToolboxTalksService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results;
      });
  }
  loadDepts() {
    return this.ToolboxTalksService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Departments = data.results;
      });
  }

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.SafetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
      });
  }

  DeleteToolboxTalks(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.ToolboxTalksService.deleteToolboxTalk(id).subscribe(data => {
        this.loadToolboxTalks(this.itemsPerPage);
      });
    }
  }
  editToolboxTalks() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.toolboxEditForm.get('date').value,
      'ticket': this.selectedTicket,
      'department': this.selectedDep,
      'agenda': this.toolboxEditForm.get('agenda').value,
      'safety_officer': this.selectedSO,
      'attendants': this.selectedEditAttendants,
      'done_by': this.toolboxEditForm.get('done_by').value,

    };
    this.selectedChecklist = localStorage.getItem('selectedToolboxChecklist');
    this.ToolboxTalksService.editToolboxTalk(this.selectedChecklist, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Toolbox Talk', 'success');
          this.loadToolboxTalks(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Toolbox Talk', 'danger');
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
    this.ToolboxTalksService.createAttendants(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          this.loadToolboxTalks(this.itemsPerPage);
          this.loadAttendants();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }

  open(dialog: TemplateRef<any>, toolbox) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.loadAttendants();
    this.changeToolboxTalks(toolbox);
  }

  openAttendants(dialog3: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }


  changeToolboxTalks(toolbox: ToolBoxTalks) {
    this.toolboxEditForm.patchValue({
      'date': this.datePipe.transform(toolbox.date, 'yyyy-MM-ddTHH:mm'),
      'ticket': toolbox.ticket === null ? '' : toolbox.ticket.id,
      'department': toolbox.department === null ? '' : toolbox.department.id,
      'safety_officer': toolbox.safety_officer === null ? '' : toolbox.safety_officer.id,
      'agenda': toolbox.agenda,
      'done_by': toolbox.done_by,
    });
    let i;
    for (i = 0; i < toolbox.attendants.length; i++) {
      this.selectedAttendants[i] = toolbox.attendants[i].id;
    }
    const setAttendants = new Set(this.selectedAttendants);

    this.ToolboxTalksService.fetchAttendees().pipe(takeWhile(() => this.alive))
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
      this.selectedEditAttendants.push(attend.id, this.attendantsToInject);
    } else {
      this.selectedEditAttendants = this.selectedEditAttendants.filter(t => {
        return t !== attend.id;
      });
    }
  }

  selectedToolboxChecklist(id) {
    localStorage.setItem('selectedToolboxChecklist', id);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  async showEdit(id) {
    localStorage.setItem('tbt', id);
    const modal = await this.modalCtrl.create({
      component: TbtPageEditComponent,
    });
    return await modal.present();
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
