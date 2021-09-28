import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService, NbComponentStatus } from '@nebular/theme';
import { TicketService } from '../../@core/services/ticket.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../@core/models/ticket';
import { UserService } from '../../@core/services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ScopeService } from '../../@core/services/ohs-scope.sercive';
import * as jwt_decode from 'jwt-decode';
import { ModalController } from '@ionic/angular';
import { TicketApprovalComponent } from '../pages/ticket-approval/ticket-approval.component';
import { ShareDataService } from '../../@core/services/shared-data.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'ngx-job',
  styleUrls: ['./job.component.scss'],
  templateUrl: './job.component.html',
})
export class JobComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;

  clickEventSubscription: Subscription;

  alive = true;

  jobForm: FormGroup;
  submitted: any;


  approver;
  requester;
  approval_item;
  comment;
  status;
  loggedInUser: any;
  jobTicket: any;

  userToken = localStorage.getItem('currentUserToken');

  searchTicket: any;

  headElements = [
    '', 'NO.', 'TICKET', 'DATE', 'TIME', 'NAME OF TICKET', 'TICKET TYPE', 'SCOPE NAME', 'SAFETY OFFICER', 'TECHNICIAN', 'TICKET STATUS', 'EDIT',
  ];

  Open: string = 'open';
  approved: string = 'approved';
  rejected: string = 'rejected';

  public jobTickets = [];
  selectedJob: any;


  page: number = 1;
  allItems: any;
  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  technicans = [];
  teamleads = [];
  safetyOfficers = [];
  works = [];
  User = [];


  years = [];
  currentYear: any;

  filterInfo: any;

  itemsPerPage = 25;

  currentUrl: any;

  public unSubscribe = new Subject();


  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private ticketService: TicketService,
    private _http: HttpClient,
    private route: ActivatedRoute,
    private toastr: NbToastrService,
    private userService: UserService,
    private scopeService: ScopeService,
    public modalCtrl: ModalController,
    private shared: ShareDataService,
    private router: Router,
  ) {
    this.jobForm = this.fb.group({
      'name': [null, Validators.required],
      'assigned_to': [null, Validators.required],
      'safety_officer': [null, Validators.required],
      'team_lead': [null, Validators.required],
      'scope': [null, Validators.required],
    });
    this.route.queryParams.subscribe(
      params => this.page = params['page'] ? params['page'] : 1,
    );
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.currentUrl = this.router.url.toString();
    this.ticketService.refresh$.subscribe(
      () => {
        this.getTickets(this.itemsPerPage);
      },
    );
    this.getTickets(this.itemsPerPage);
    this.getAllUsers();
    this.getScopeOfWork();
    this.generateArrayOfYears();
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
          targets: [6, 7, 8, 9],
        },
        {
          searchPanes: {
            show: false,
          },
          targets: [6],
        },
        {
          orderable: false,
          className: 'select-checkbox',
          targets: 0,
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
            if (this.filterInfo.year === 'today') {
              this.todayFilter(this.itemsPerPage, this.filterInfo.year);
            } else {
              this.yearFilter(this.itemsPerPage, this.filterInfo.year);
            }
          }
          if (this.filterInfo.start_date !== null && this.filterInfo.end_date !== null) {
            this.dateFilter(this.itemsPerPage, this.filterInfo.start_date, this.filterInfo.end_date);
          }
          // if (this.filterInfo.technician !== null) {
          //   this.technicanFilter(this.itemsPerPage, this.filterInfo.technician);
          // }
          // if (this.filterInfo.safety_officer !== null) {
          //   this.safetyOfficerFilter(this.itemsPerPage, this.filterInfo.safety_officer);
          // }
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
          this.searchTickets(term);
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
          this.getTickets(this.itemsPerPage);
        }
      });

  }



  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.User = data.results;
        this.teamleads = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER' || user.role.name === 'TEAM LEAD';
          }
        });
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


  getScopeOfWork() {
    this.scopeService.fetchScope(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.works = data.results;
        },
      );
  }

  getTickets(num) {
    this.ticketService.fetchTickets(num)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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
        },
      );
  }

  searchTickets(searchTerm) {
    this.ticketService.searchTicket(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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
            this.jobTickets = data.results;
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
            this.jobTickets = data.results;
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

  yearFilter(items, year) {
    this.ticketService.filterByYear(items, year)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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

  todayFilter(items, today) {
    this.ticketService.filterByToday(items, today)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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

  technicanFilter(items, id) {
    this.ticketService.filterBYTechnician(items, id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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


  safetyOfficerFilter(items, id) {
    this.ticketService.filterBySafety(items, id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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



  dateFilter(items, start, end) {
    this.ticketService.filterDate(items, start, end)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.jobTickets = data.results;
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

  onActivate(event) {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }


  generateArrayOfYears() {
    // get current year from today's date
    this.currentYear = new Date().getFullYear();
    const min = 2020;

    // loop from current year to 2020 and add to list
    for (let i = this.currentYear; i >= min; i--) {
      this.years.push(i);
    }

    return this.years;
  }

  // onChangeYear(evt) {
  //   this.ticketService.filterByYear(this.itemsPerPage, this.currentYear)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(
  //       data => {
  //         this.jobTickets = data.results;
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
  //   this.getTickets(null);
  // }




  open(dialog: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }


  editTicket() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'name': this.jobForm.get('name').value,
      'assigned_to': this.jobForm.get('assigned_to').value,
      'safety_officer': this.jobForm.get('safety_officer').value,
      'team_lead': this.jobForm.get('team_lead').value,
      'scope': this.jobForm.get('scope').value,
    };
    this.ticketService.editTicket(this.selectedJob.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Ticket', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Ticket', 'danger');
        },
      );
  }

  openJobForm(dialog: TemplateRef<any>, job) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    this.selectedJob = job;
    this.changeTicket(job);
  }
  setTicketToView(id) {
    localStorage.setItem('selectedTicket', id);

  }


  createApproval() {
    const modalCloseBtn = document.getElementById('close-approval');
    this.submitted = true;
    const approvalItem = 'approval for ticket:' + this.selectedJob.ticket_code;
    const approvaldata = {
      'approver': this.loggedInUser.id,
      'requester': this.selectedJob.assigned_to.id,
      'approval_item': approvalItem,
      'comment': this.comment,
      'status': this.status,
    };
    const payload = {
      'ohs_approval': approvaldata,
    };
    this.ticketService.editTicket(this.selectedJob.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully approved the Ticket', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to approve Ticket', 'danger');
        },
      );
  }

  openApproval(dialog2: TemplateRef<any>, job) {
    if (job.safety_officer !== null && job.safety_officer.id === this.loggedInUser.id) {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
      this.selectedJob = job;
    } else {
      this.showToast('You do not have authorization to perform this action. Please contact the Admin for help', 'warning');
    }
  }

  changeTicket(job: Ticket) {
    this.jobForm.patchValue({
      name: job.name,
      assigned_to: job.assigned_to === null ? '' : job.assigned_to.id,
      safety_officer: job.safety_officer === null ? '' : job.safety_officer.id,
      team_lead: job.team_lead === null ? '' : job.team_lead.id,
      scope: job.scope === null ? '' : job.scope.id,
    });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }



  identify(index, item) {
    return item.id;
  }

  async showModal(id, job) {
    this.setTicketToView(id);
    if (job.safety_officer !== null && job.safety_officer.id === this.loggedInUser.id) {
      const modal = await this.modalCtrl.create({
        component: TicketApprovalComponent,
      });
      return await modal.present();
    } else {
      this.showToast('You do not have authorization to perform this action. Please contact the Admin for help', 'warning');
    }
  }

  ngOnDestroy() {
    this.alive = false;
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
