import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { WorkpermitService } from '../../@core/services/workpermit.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
// import { DatePipe } from '@angular/common';
import { Workpermit } from '../../@core/models/workpermit';
import * as jwt_decode from 'jwt-decode';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ModalController } from '@ionic/angular';
import { ShareDataService } from '../../@core/services/shared-data.service';
import { Router } from '@angular/router';




@Component({
  selector: 'ngx-workpermits',
  templateUrl: './workpermits.component.html',
  styleUrls: ['./workpermits.component.scss'],
})
export class WorkpermitsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;
  userToken = localStorage.getItem('currentUserToken');


  Scope = [];
  Department = [];
  Supervisor = [];
  ProjectManager = [];
  HOD = [];
  SafetyOfficer = [];
  WorkPermits = [];

  Ticket = [];
  Permit: any;
  ticketid: string;
  selectedWorkPermits = [];

  ptwPermits = [];
  loggedInUser: any;
  selectedApprovalWorkPermit: any;


  User = [];

  alive = true;
  submitted = false;
  post: any;
  selectedChecklist;
  selectedPreviewChecklist;
  selectedWorkPermit;

  public addActivity;
  public addControl;
  public addHazardControl;
  approver;
  requester;
  approval_item;
  comment;
  status;


  workpermitEditForm: FormGroup;
  headElements = [
    '',
    'ID',
    'DATE',
    'TIME',
    'TICKET',
    // 'REFERENCE NO.',
    // 'PPES',
    // 'CERTIFICATIONS',
    // 'PERMITS',
    // 'COMMUNICATION PLAN',
    'SECURITY/ENVIRONMENTAL CONCERNS',
    'SAFETY ACCESS',
    'SCOPE',
    'DEPARTMENT',
    'SUPERVISOR',
    'PROJECT MANAGER',
    'H.O.D',
    'COMM PLAN',
    'SAFETY OFFICER',
    'PTW STATUS',
    'PREVIEW',
    'EDIT',
    'DELETE',
  ];

  approved = 'approved';
  rejected = 'rejected';
  department: any;
  searchPermit: any;

  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  currentUrl: any;
  public unSubscribe = new Subject();

  constructor(
    private dialogService: NbDialogService,
    public WorkPermitService: WorkpermitService,
    private fb: FormBuilder,
    private toastr: NbToastrService,
    private userService: UserService,
    public modalCtrl: ModalController,
    // private datePipe: DatePipe,
    private _http: HttpClient,
    private shared: ShareDataService,
    private router: Router,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.currentUrl = this.router.url.toString();

    this.WorkPermitService.refresh$.subscribe(
      () => {
        this.loadWorkpermits(this.itemsPerPage);
      },
    );
    this.loadWorkpermits(this.itemsPerPage);
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      colReorder: true,
      pageLength: 1000,
      // dom: 'lBfrtip',
      dom: 'Brt',
      columnDefs: [
        {
          searchPanes: {
            show: true,
          },
          targets: [2, 5, 6, 7, 8, 9, 10, 11],
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
          this.loadWorkpermits(this.itemsPerPage);
        }
      });

    this.workpermitEditForm = this.fb.group({
      'safety_or_concerns': [null],
      'safety_access': [null],
      'department': [null],
      'project_manager': [null],
      'hod': [null],
      'permits': this.selectedWorkPermits,


    });
  }
  loadWorkpermits(num) {
    return this.WorkPermitService.fetchWorkpermits(num).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.WorkPermits = data.results;
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

  // onChange(event: any) {
  //   this.itemsPerPage = event;
  //   this.dtOptions.pageLength = event;
  //   this.loadWorkpermits();
  // }

  searchDetails(searchTerm) {
    this.WorkPermitService.searchPermit(searchTerm)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.WorkPermits = data.results;
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
            this.WorkPermits = data.results;
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
            this.WorkPermits = data.results;
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
    this.WorkPermitService.filterByYear(items, year)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.WorkPermits = data.results;
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
    this.WorkPermitService.filterDate(items, start, end)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.WorkPermits = data.results;
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
    this.WorkPermitService.filterByToday(items, today)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.WorkPermits = data.results;
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


  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.User = data.results;
        this.Supervisor = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
        this.ProjectManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
        this.HOD = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'ADMIN' || user.role.name === 'HOD';
          }
        });
        this.SafetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
      });
  }

  loadScope() {
    return this.WorkPermitService.fetchScope().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Scope = data.results;
      });
  }
  loadDepartments() {
    return this.WorkPermitService.fetchDepartments().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Department = data.results;
      });
  }
  loadPermit() {
    return this.WorkPermitService.fetchPermits().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.ptwPermits = data.results;
      });
  }

  loadTicket() {
    return this.WorkPermitService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Ticket = data.results;
      });
  }
  loadOnePermit() {
    this.selectedPreviewChecklist = localStorage.getItem('selectedWorkPermit');
    return this.WorkPermitService.fetchOnePermit(this.selectedPreviewChecklist).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Permit = data;
      });
  }

  DeleteWorkPermits(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.WorkPermitService.deleteWorkpermits(id).subscribe(data => {
        // this.loadWorkpermits();
      });
    }
  }

  editWorkPermits() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'safety_or_concerns': this.workpermitEditForm.get('safety_or_concerns').value,
      'safety_access': this.workpermitEditForm.get('safety_access').value,
      'department': this.workpermitEditForm.get('department').value,
      'project_manager': this.workpermitEditForm.get('project_manager').value,
      'hod': this.workpermitEditForm.get('hod').value,
      'communication_plan': this.workpermitEditForm.get('communication_plan').value,
      'permits': this.workpermitEditForm.get('permits').value,
    };
    this.selectedChecklist = localStorage.getItem('selectedWorkPermit');
    this.WorkPermitService.editWorkpermits(this.selectedChecklist, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Permit to Work', 'success');
          // this.loadWorkpermits();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Permit to Work', 'danger');
        },
      );
  }

  createApproval() {
    const modalCloseBtn = document.getElementById('close-approval');
    this.submitted = true;
    const approvalItem = 'approval for PTW' + this.selectedApprovalWorkPermit.work_permit;
    const safetyapprovaldata = {
      'approver': this.loggedInUser.id,
      'requester': this.selectedApprovalWorkPermit.safety_officer.id,
      'approval_item': approvalItem,
      'comment': this.comment,
      'status': this.status,
    };
    const payload = {
      'approval': safetyapprovaldata,
    };
    this.WorkPermitService.editWorkpermits(this.selectedApprovalWorkPermit.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an approval', 'success');
          // this.loadWorkpermits(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create approval', 'danger');
        },
      );
  }

  open(dialog: TemplateRef<any>, workpermit) {
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.getAllUsers();
    this.loadScope();
    this.loadDepartments();
    this.loadPermit();
    this.changeWorkPermit(workpermit);
  }

  create(dialog3: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.getAllUsers();
    this.loadScope();
    this.loadDepartments();
  }
  changeWorkPermit(workpermit: Workpermit) {
    this.workpermitEditForm.patchValue({
      'safety_or_concerns': workpermit.safety_or_concerns,
      'safety_access': workpermit.safety_access,
      'scope': workpermit.scope,
      'department': workpermit.department === null ? '' : workpermit.department.id,
      'supervisor': workpermit.supervisor === null ? '' : workpermit.supervisor.id,
      'permits': workpermit.permits === null ? '' : workpermit.permits.id,
      'project_manager': workpermit.project_manager === null ? '' : workpermit.project_manager.id,
      'hod': workpermit.hod === null ? '' : workpermit.hod.id,
      'communication_plan': workpermit.communication_plan === null ? '' : workpermit.communication_plan.id,
    });
  }


  openSafety(dialog2: TemplateRef<any>, workpermit) {
    if (workpermit.safety_officer !== null && workpermit.safety_officer.id === this.loggedInUser.id) {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
      this.getAllUsers();
      this.selectedApprovalWorkPermit = workpermit;
    } else {
      this.showToast('You do not have authorization to perform this action. Please contact the Admin for help', 'warning');
    }
  }
  selectedWorkpermitChecklist(id) {
    localStorage.setItem('selectedWorkPermit', id);
  }
  selectedSiteID(id) {
    localStorage.setItem('selectedWorkpermitSiteId', id);
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }
  openPermit(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    this.loadOnePermit();
  }

  public convetToPDF() {
    const data = document.getElementById('ptwToConvert');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('permit.pdf'); // Generated PDF
    });
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
