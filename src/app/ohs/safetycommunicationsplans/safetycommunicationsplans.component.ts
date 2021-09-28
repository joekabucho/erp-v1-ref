import { Component, TemplateRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { CommunicationPlanService } from '../../@core/services/communication-plan.service';
import { takeWhile, takeUntil } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
import { DatePipe } from '@angular/common';
import { CommunicationPlan } from '../../@core/models/communication';
import * as jwt_decode from 'jwt-decode';
import { ModalController } from '@ionic/angular';
import { CommEditComponent } from '../report-pages/comm-edit/comm-edit.component';
import { ShareDataService } from '../../@core/services/shared-data.service';


@Component({
  selector: 'ngx-safetycommunicationsplans',
  templateUrl: './safetycommunicationsplans.component.html',
  styleUrls: ['./safetycommunicationsplans.component.scss'],
})
export class SafetycommunicationsplansComponent implements OnDestroy, OnInit {

  keywordSite = 'name';
  keywordPM = 'first_name';
  keywordScope = 'name';
  keywordLoc = 'name';

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;
  alive = true;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  Communication = [];
  Locations = [];
  Sites = [];
  Scopes = [];
  Projectmanagers = [];
  Users = [];

  communicationForm: FormGroup;
  communicationEditForm: FormGroup;
  siteForm: FormGroup;


  submitted = false;
  post: any;
  selectedChecklist;
  Date;

  searchItem: any;

  public selectedSite: any;
  public selectedPM: any;
  public selectedScope: any;
  public selectedLoc: any;

  public addActivity;
  public addControl;
  headElements = [
    '', 'ID', 'DATE', 'TIME', 'NAME', 'LOCATION', 'SITE', 'SCOPE', 'PROJECT MANAGER', 'FIRST AIDER',
    'FIRST AIDER TEL NO', 'FIRE MARSHALL', 'FIRE MARSHALL TEL NO', 'NEAREST POLICE', 'NEAREST POLICE TEL NO', 'NEAREST HOSPITAL', 'NEAREST HOSPITAL TEL NO', 'WHAT TO SO IN AN EMERGENCY', ' WHAT TO SO IN AN ACCIDENT', ' CREATED BY', 'EDIT', 'DELETE',
  ];

  nextPage: any = null;
  previousPage: any = null;
  totalCount: any;
  itemsPerPage = 25;
  filterInfo: any;
  currentUrl: any;
  public unSubscribe = new Subject();

  constructor(
    private dialogService: NbDialogService,
    public CommunicationService: CommunicationPlanService,
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
    this.CommunicationService.refresh$.subscribe(
      () => {
        this.loadCommunication(this.itemsPerPage);
      },
    );
    this.loadCommunication(this.itemsPerPage);
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
          targets: [2, 3, 4, 5, 6, 16],
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
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        {
          extend: 'pdf', className: 'btn btn-outline-danger ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        {
          extend: 'csv', className: 'btn btn-outline-info ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        {
          extend: 'copy', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        {
          extend: 'print', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
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
          this.loadCommunication(this.itemsPerPage);
        }
      });
    this.transformDate();
    this.communicationForm = this.fb.group({
      'date': [null, Validators.required],
      'location': [null, Validators.required],
      'site': [null, Validators.required],
      'scope': [null, Validators.required],
      'project_manager': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'first_aider_phone': [null, Validators.required],
      'fire_marshall': [null, Validators.required],
      'fire_marshall_phone': [null, Validators.required],
      'nearest_police': [null, Validators.required],
      'nearest_police_phone': [null, Validators.required],
      'nearest_hospital': [null, Validators.required],
      'nearest_hospital_phone': [null, Validators.required],
      'what_do_in_an_emergency': [null, Validators.required],
      'what_do_in_an_accident': [null, Validators.required],
      'name': [null, Validators.required],
    });
    this.communicationEditForm = this.fb.group({
      'date': [null, Validators.required],
      'location': [null, Validators.required],
      'site': [null, Validators.required],
      'scope': [null, Validators.required],
      'project_manager': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'first_aider_phone': [null, Validators.required],
      'fire_marshall': [null, Validators.required],
      'fire_marshall_phone': [null, Validators.required],
      'nearest_police': [null, Validators.required],
      'nearest_police_phone': [null, Validators.required],
      'nearest_hospital': [null, Validators.required],
      'nearest_hospital_phone': [null, Validators.required],
      'what_do_in_an_emergency': [null, Validators.required],
      'what_do_in_an_accident': [null, Validators.required],
      'name': [null, Validators.required],
    });
    this.siteForm = this.fb.group({
      'name': [null, Validators.required],
      'location': [null, Validators.required],
    });
  }
  transformDate() {
    this.Date = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }


  selectedScopeDrop(item) {
    // do something with selected item
    this.selectedScope = item.id;
  }
  selectPM(item) {
    // do something with selected item
    this.selectedPM = item.id;
  }
  selectLoc(item) {
    // do something with selected item
    this.selectedLoc = item.id;
  }
  selectSite(item) {
    // do something with selected item
    this.selectedSite = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedLoc(e) {
    // do something when input is focused
    this.loadLocations();
  }
  onFocusedScope(e) {
    // do something when input is focused
    this.loadScopes();
  }
  onFocusedSite(e) {
    // do something when input is focused
    this.loadSites();
  }
  onFocusedPM(e) {
    // do something when input is focused
    this.getAllUsers();
  }
  loadCommunication(num) {
    return this.CommunicationService.fetchCommunication(num).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Communication = data.results;
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

  searchDetails(searchItem) {
    this.CommunicationService.searchCommunication(searchItem)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Communication = data.results;
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
            this.Communication = data.results;
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
            this.Communication = data.results;
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
  //   this.loadCommunication();
  // }

  DeleteCommunications(id) {
    if (window.confirm('Are you sure, you want to delete?')) {
      this.CommunicationService.deleteCommunication(id).subscribe(data => {
        this.loadCommunication(this.itemsPerPage);
      });
    }
  }
  editCommunications() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.communicationEditForm.get('date').value,
      'location': this.selectedLoc,
      'site': this.selectedSite,
      'scope': this.communicationForm.get('scope').value,
      'project_manager': this.selectedPM,
      'first_aider': this.communicationEditForm.get('first_aider').value,
      'first_aider_phone': this.communicationEditForm.get('first_aider_phone').value,
      'fire_marshall': this.communicationEditForm.get('fire_marshall').value,
      'fire_marshall_phone': this.communicationEditForm.get('fire_marshall_phone').value,
      'nearest_police': this.communicationEditForm.get('nearest_police').value,
      'nearest_police_phone': this.communicationEditForm.get('nearest_police_phone').value,
      'nearest_hospital': this.communicationEditForm.get('nearest_hospital').value,
      'nearest_hospital_phone': this.communicationEditForm.get('nearest_hospital_phone').value,
      'what_do_in_an_emergency': this.communicationEditForm.get('what_do_in_an_emergency').value,
      'what_do_in_an_accident': this.communicationEditForm.get('what_do_in_an_accident').value,
      'name': this.communicationEditForm.get('name').value,
      'created_by': this.loggedInUser.id,
    };
    this.selectedChecklist = localStorage.getItem('selectedCommunicationChecklist');
    this.CommunicationService.editCommunication(this.selectedChecklist, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Safety communication plan', 'success');
          this.loadCommunication(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to edit Safety communication plan', 'danger');
        },
      );
  }

  createCommunications() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.communicationForm.get('date').value,
      'location': this.selectedLoc,
      'site': this.selectedSite,
      'scope': this.communicationForm.get('scope').value,
      'project_manager': this.selectedPM,
      'first_aider': this.communicationForm.get('first_aider').value,
      'first_aider_phone': this.communicationForm.get('first_aider_phone').value,
      'fire_marshall': this.communicationForm.get('fire_marshall').value,
      'fire_marshall_phone': this.communicationForm.get('fire_marshall_phone').value,
      'nearest_police': this.communicationForm.get('nearest_police').value,
      'nearest_police_phone': this.communicationForm.get('nearest_police_phone').value,
      'nearest_hospital': this.communicationForm.get('nearest_hospital').value,
      'nearest_hospital_phone': this.communicationForm.get('nearest_hospital_phone').value,
      'what_do_in_an_emergency': this.communicationForm.get('what_do_in_an_emergency').value,
      'what_do_in_an_accident': this.communicationForm.get('what_do_in_an_accident').value,
      'name': this.communicationForm.get('name').value,
      'created_by': this.loggedInUser.id,
    };
    this.CommunicationService.createCommunication(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Safety communication plan', 'success');
          this.loadCommunication(this.itemsPerPage);
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create Safety communication plan', 'danger');
        },
      );
  }

  createSite() {
    const modalCloseBtn = document.getElementById('close-site');
    this.submitted = true;
    const payload = {
      'name': this.siteForm.get('name').value,
      'location': this.siteForm.get('location').value,
    };
    this.CommunicationService.createSite(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created the Site', 'success');
          this.loadSites();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to create Site', 'danger');
        },
      );
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Users = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN' || 'SAFETY OFFICER' || 'TEAM LEAD';
          }
        });
        this.Projectmanagers = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
      });
  }

  loadLocations() {
    return this.CommunicationService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Locations = data.results;
      });
  }
  loadSites() {
    return this.CommunicationService.fetchSites().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Sites = data.results;
      });
  }
  loadScopes() {
    return this.CommunicationService.fetchScopes().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Scopes = data.results;
      });
  }

  open(dialog: TemplateRef<any>, safety) {
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.getAllUsers();
    this.changeCommunicationPlan(safety);
    this.loadScopes();
  }
  openSite(dialog3: TemplateRef<any>) {
    this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
  }

  create(dialog1: TemplateRef<any>) {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
      this.loadScopes();
  }
  changeCommunicationPlan(safety: CommunicationPlan) {
    this.communicationEditForm.patchValue({
      'date': this.datePipe.transform(safety.date, 'yyyy-MM-ddTHH:mm'),
      'location': safety.location === null ? '' : safety.location.id,
      'site': safety.site === null ? '' : safety.site.id,
      'scope': safety.scope === null ? '' : safety.scope.id,
      'project_manager': safety.project_manager === null ? '' : safety.project_manager.id,
      'first_aider': safety.first_aider,
      'first_aider_phone': safety.first_aider_phone,
      'fire_marshall': safety.fire_marshall,
      'fire_marshall_phone': safety.fire_marshall_phone,
      'nearest_police': safety.nearest_police,
      'nearest_police_phone': safety.nearest_police_phone,
      'nearest_hospital': safety.nearest_hospital,
      'nearest_hospital_phone': safety.nearest_hospital_phone,
      'what_do_in_an_emergency': safety.what_do_in_an_emergency,
      'what_do_in_an_accident': safety.what_do_in_an_accident,
      'name': safety.name,
      'created_by': safety.created_by,
    });
  }

  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: CommEditComponent,
    });
    localStorage.setItem('commPlan', id);
    return await modal.present();
  }

  selectedCommunicationChecklist(id) {
    localStorage.setItem('selectedCommunicationChecklist', id);
  }

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

  flush() {
    this.communicationForm.reset();
  }

}
