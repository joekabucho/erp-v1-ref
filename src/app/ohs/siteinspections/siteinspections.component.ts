import {Component, TemplateRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { SiteInspectionService } from '../../@core/services/site-inspection.service';
import { takeWhile } from 'rxjs/operators';
import { SiteInspection } from '../../@core/models/site-inspection';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../@core/services/user.service';
import * as jwt_decode from 'jwt-decode';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {DatePipe} from '@angular/common';
import { ModalController} from '@ionic/angular';
import {SiteInspaectionEditComponent} from '../report-pages/site-inspaection-edit/site-inspaection-edit.component';
import {SiteInspectionAddComponent} from '../report-pages/site-inspection-add/site-inspection-add.component';




@Component({
  selector: 'ngx-siteinspections',
  templateUrl: './siteinspections.component.html',
  styleUrls: ['./siteinspections.component.scss'],
})
export class SiteinspectionsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  isDtInitialized: boolean = false;
  alive = true;

  keywordSite = 'name';
  public selectedSite: any;



  inspectionForm: FormGroup;
  inspectionEditForm: FormGroup;
  submitted: boolean;

  selectedSiteInspection: any;
  allUsers: any;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
  Sites = [];


  searchItem: any;
  itemsPerPage: number;

  headElements = [
    '', 'ID', 'REFERENCE', 'DATE', 'TIME',  'SITE', 'CONTRACTOR', 'SITE ENGINEER', 'DESC OF WORK', 'PPE', 'RISK TREATMENT', 'COMPLIANCE TO SAFARICOM ABSOLUTE RULES', 'PROVISION OF WORK EQUIPMENT', 'EMERGENCY RESPONSE', 'EDIT', 'DELETE',
  ];

  siteInspection = [];

  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private inspectionService: SiteInspectionService,
    private toastr: NbToastrService,
    private userService: UserService,
    private datePipe: DatePipe,
    public modalCtrl: ModalController,

  ) {
    this.inspectionForm = this.fb.group({
      'date': [null, Validators.required],
      'ref_number': [null, Validators.required],
      'site': [null, Validators.required],
      'contractor': [null, Validators.required],
      'site_engineer': [null, Validators.required],
      'work_description': [null, Validators.required],
      'ppe': [null, Validators.required],
      'risk_treatment': [null, Validators.required],
      'compliance_to_safaricom': [null, Validators.required],
      'provision_of_work_equipment': [null, Validators.required],
      'emergency_response': [null, Validators.required],
    });

    this.inspectionEditForm = this.fb.group({
      'date': [null, Validators.required],
      'ref_number': [null, Validators.required],
      'site': [null, Validators.required],
      'contractor': [null, Validators.required],
      'site_engineer': [null, Validators.required],
      'work_description': [null, Validators.required],
      'ppe': [null, Validators.required],
      'risk_treatment': [null, Validators.required],
      'compliance_to_safaricom': [null, Validators.required],
      'provision_of_work_equipment': [null, Validators.required],
      'emergency_response': [null, Validators.required],
    });
    this.loggedInUser = jwt_decode(this.userToken);
  }

  ngOnInit() {
    this.itemsPerPage = 25;
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      colReorder: true,
      pageLength: this.itemsPerPage,
      dom: 'Brtip',
      columnDefs: [
        {
          searchPanes: {
            show: true,
          },
          targets: [3, 4],
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
        { extend: 'excel', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        { extend: 'pdf', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        { extend: 'csv', className: 'btn btn-outline-primary ml-2' ,
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        { extend: 'copy', className: 'btn btn-outline-primary ml-2' ,
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        {
          extend: 'print', className: 'btn btn-outline-primary ml-2',
          exportOptions: {
            columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
          },
        },
        { extend: 'colvis', className: 'btn btn-outline-primary ml-2'},
        { extend: 'searchPanes', className: 'btn btn-outline-primary ml-2' },
        { extend: 'selectAll', className: 'btn btn-outline-primary ml-2' },
        {extend: 'selectNone', className: 'btn btn-outline-primary ml-2'},


      ],
    };
    this.inspectionService.refresh$.subscribe(
      () => {
        this.getSiteInspection();
      },
    );
    this.getSiteInspection();
    this.getAllUsers();
    this.loadSites();
  }

  selectSite(item) {
    // do something with selected item
    this.selectedSite = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedSite(e) {
    // do something when input is focused
    this.loadSites();
  }
  getSiteInspection() {
    this.inspectionService.fetchSiteInspection(this.itemsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.siteInspection = data.results;
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

  fetchDetails() {
    this.inspectionService.searchSiteInspection(this.searchItem)
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      data => {
        this.siteInspection = data.results;
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


  onChange(event: any) {
    this.itemsPerPage = event;
    this.dtOptions.pageLength = event;
    this.getSiteInspection();
  }

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.allUsers = data.results;
      });
  }

  loadSites() {
    return this.inspectionService.fetchSites().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Sites = data.results;
      });
  }


  openEditForm(dialog: TemplateRef<any>, site) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    // console.log(site);
    this.changeSiteInspection(site);
    this.selectedSiteInspection = site;
    this.loadSites();
  }

  create(dialog1: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    }, 1000);    this.loadSites();
  }


  changeSiteInspection(site: SiteInspection) {
    this.inspectionEditForm.patchValue({
      'date': this.datePipe.transform(site.date, 'yyyy-MM-ddTHH:mm') ,
      'ref_number': site.ref_number,
      'site': site.site === null ? '' : site.site.id,
      'contractor': site.contractor,
      'site_engineer': site.site_engineer,
      'work_description': site.work_description,
      'ppe': site.ppe,
      'risk_treatment': site.risk_treatment,
      'compliance_to_safaricom': site.compliance_to_safaricom,
      'provision_of_work_equipment': site.provision_of_work_equipment,
      'emergency_response': site.emergency_response,
    });
  }

  saveSiteInspection() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.inspectionEditForm.get('date').value,
      'ref_number': this.inspectionEditForm.get('ref_number').value,
      'site': this.selectedSite,
      'contractor': this.inspectionEditForm.get('contractor').value,
      'site_engineer': this.inspectionEditForm.get('site_engineer').value,
      'work_description': this.inspectionEditForm.get('work_description').value,
      'ppe': this.inspectionEditForm.get('ppe').value,
      'risk_treatment': this.inspectionEditForm.get('risk_treatment').value,
      'compliance_to_safaricom': this.inspectionEditForm.get('compliance_to_safaricom').value,
      'provision_of_work_equipment': this.inspectionEditForm.get('provision_of_work_equipment').value,
      'emergency_response': this.inspectionEditForm.get('emergency_response').value,
      'created_by': this.loggedInUser.id,
    };

    this.inspectionService.editSiteInspection(this.selectedSiteInspection.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Site Inspection', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Site Inspection', 'danger');
        },
      );
  }

 createSiteInspection() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'date': this.inspectionForm.get('date').value,
      'ref_number': this.inspectionForm.get('ref_number').value,
      'site': this.selectedSite,
      'contractor': this.inspectionForm.get('contractor').value,
      'site_engineer': this.inspectionForm.get('site_engineer').value,
      'work_description': this.inspectionForm.get('work_description').value,
      'ppe': this.inspectionForm.get('ppe').value,
      'risk_treatment': this.inspectionForm.get('risk_treatment').value,
      'compliance_to_safaricom': this.inspectionForm.get('compliance_to_safaricom').value,
      'provision_of_work_equipment': this.inspectionForm.get('provision_of_work_equipment').value,
      'emergency_response': this.inspectionForm.get('emergency_response').value,
      'created_by': this.loggedInUser.id,
    };
   this.inspectionService.createSiteInspection( payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully add the Site Inspection', 'success');
          this.inspectionForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to add Site Inspection', 'danger');
        },
      );
  }
  flush() {
    this.inspectionForm.reset();
  }

  confirmDelete(site: any) {
    const x = confirm('Are you sure you want to delete this data?');
    if (x) {
      this.inspectionService.deleteSiteInspection(site.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Deleted`, 'success');
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

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: SiteInspaectionEditComponent,
    });
    localStorage.setItem('inspection', id);
    return await modal.present();
  }
  async showModal() {
    const modal = await this.modalCtrl.create({
      component: SiteInspectionAddComponent,
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  identify(index, item) {
    return item.id;
  }

}
