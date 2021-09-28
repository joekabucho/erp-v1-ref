import {Component, TemplateRef, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { SetupService } from '../../@core/services/setup.service';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import {Location, Attendants, CertNames, Departments, Hazard, PPEnames, Scope, Sites, SSEnames} from '../../@core/models/setup';

@Component({
  selector: 'ngx-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {

  keywordDep = 'name';
  keywordLoc = 'name';
  keywordDiv = 'name';
  keywordTeam = 'name';

  public selectedLoc: any;
  public selectedDep: any;
  public selectedDiv: any;
  public selectedTeam: any;


  alive = true;

  certificatesnames = [];
  ppenames = [];
  allppenames = [];
  ssenames = [];
  Locations = [];
  Scope = [];
  Hazard = [];
  Attendants = [];
  Departments = [];
  Sites = [];
  teams = [];

 public selectedcertificatesnames ;
  public selectedppenames ;
  public selectedallppenames ;
  public selectedssenames ;
  public selectedLocations ;
  public selectedScope ;
  public selectedHazard ;
  public selectedAttendants ;
  public selectedDepartments ;
  public selectedSites ;
  public selectedteams ;


  LocDetails: any = [];
  latitude: number;
  longitude: number;




  public sseForm: FormGroup;
  public certForm: FormGroup;
  public ppeForm: FormGroup;
  public locForm: FormGroup;
  public attendantForm: FormGroup;
  public hazForm: FormGroup;
  public depForm: FormGroup;
  public siteForm: FormGroup;
  public scopeForm: FormGroup;

  public sseEditForm: FormGroup;
  public certEditForm: FormGroup;
  public ppeEditForm: FormGroup;
  public locEditForm: FormGroup;
  public attendantEditForm: FormGroup;
  public hazEditForm: FormGroup;
  public depEditForm: FormGroup;
  public siteEditForm: FormGroup;
  public scopeEditForm: FormGroup;

  public allTeams: any  = [];
  submitted: boolean;

  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;
   divisions = [];


  constructor(
               private dialogService: NbDialogService,
               private fb: FormBuilder,
               private setupService: SetupService,
               private toastr: NbToastrService,
    ) {
    this.siteForm = this.fb.group({
      'name': [null, Validators.required],
      'location': [null, Validators.required],
    });
    this.depForm = this.fb.group({
      'division': [null, Validators.required],
      'name': [null, Validators.required],
      'teams': this.allTeams,
    });
    this.locForm = this.fb.group({
      'name': [null, Validators.required],
      'latitude': [null, Validators.required],
      'longitude': [null, Validators.required],

    });
    this.scopeForm = this.fb.group({
      'name': [null, Validators.required],
      'risk': [null, Validators.required],
      'department': [null, Validators.required],
      'hazards': [null, Validators.required],
      'activity': [null, Validators.required],
    });
    this.attendantForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
    this.ppeForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.sseForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.certForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.hazForm = this.fb.group({
      'name': [null, Validators.required],
      'control': [null, Validators.required],
      'consequence': [null, Validators.required],
    });

    this.siteEditForm = this.fb.group({
      'name': [null, Validators.required],
      'location': [null, Validators.required],
    });
    this.depEditForm = this.fb.group({
      'division': [null, Validators.required],
      'name': [null, Validators.required],
      'teams': this.allTeams,
    });
    this.locEditForm = this.fb.group({
      'name': [null, Validators.required],
      'latitude': [null, Validators.required],
      'longitude': [null, Validators.required],

    });
    this.scopeEditForm = this.fb.group({
      'name': [null, Validators.required],
      'risk': [null, Validators.required],
      'department': [null, Validators.required],
      'hazards': [null, Validators.required],
      'activity': [null, Validators.required],
    });
    this.attendantEditForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
    this.ppeEditForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.sseEditForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.certEditForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.hazEditForm = this.fb.group({
      'name': [null, Validators.required],
      'control': [null, Validators.required],
      'consequence': [null, Validators.required],
    });
    this.loggedInUser = jwt_decode(this.userToken);


  }

  ngOnInit() {
    this.setupService.refresh$.subscribe(
      () => {
        this.getHazards();
        this.getLocations();
        this.getScopeOfWork();
        this.getDepartments();
        this.getSites();
        this.getCertificates();
        this.getPPEs();
        this.getSSEs();
        this.getAttendees();

      },
    );
    this.getHazards();
    this.getLocations();
    this.getScopeOfWork();
    this.getDepartments();
    this.getSites();
    this.getCertificates();
    this.getPPEs();
    this.getSSEs();
    this.getAttendees();



  }

  selectDep(item) {
    // do something with selected item
    this.selectedDep = item.id;
  }
  selectLoc(item) {
    // do something with selected item
    this.selectedLoc = item.id;
  }
  selectDiv(item) {
    // do something with selected item
    this.selectedDiv = item.id;
  }
  selectTeam(item) {
    // do something with selected item
    this.selectedTeam = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocusedLoc(e) {
    // do something when input is focused
    this.getLocations();
  }
  onFocusedDepartment(e) {
    // do something when input is focused
    this.getDepartments();
  }
  onFocusedDivisions(e) {
    // do something when input is focused
    this.loadDivisions();
  }
  onFocusedTeams(e) {
    // do something when input is focused
    this.loadTeams();
  }
  getHazards() {
    this.setupService.fetchHazards(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Hazard = data.results;
        },
      );

  }

  getLocations() {
    this.setupService.fetchLocation(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Locations = data.results;
        },
      );

  }
  getAttendees() {
    this.setupService.fetchAttendees(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Attendants = data.results;
        },
      );

  }
  getDepartments() {
    this.setupService.fetchDepartments(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Departments = data.results;
        },
      );

  }
  getSites() {
    this.setupService.fetchSiteNames(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Sites = data.results;
        },
      );

  }
  getCertificates() {
    this.setupService.fetchCertificate(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.certificatesnames = data.results;
        },
      );

  }
  getPPEs() {
    this.setupService.fetchPPE(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppenames = data.results;
        },
      );

  }
  getSSEs() {
    this.setupService.fetchSiteSSE(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ssenames = data.results;
        },
      );

  }
  getScopeOfWork() {
    this.setupService.fetchScope(50)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Scope = data.results;
        },
      );

  }

  loadTeams() {
    return this.setupService.fetchTeams().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.teams = data.results;
      });
  }

  loadDivisions() {
    return this.setupService.fetchDivisions().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.divisions = data.results;
      });
  }

  saveScope() {
    const modalCloseBtn = document.getElementById('close-save-scope');
    this.submitted = true;
    const payload = {
      'name': this.scopeForm.get('name').value,
      'risk': this.scopeForm.get('risk').value,
      'department': this.selectedDep,
      'hazards': this.scopeForm.get('hazards').value,
      'activity': this.scopeForm.get('activity').value,
      'created_by': this.loggedInUser.id,
    };
    this.setupService.createScope(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully add the Scope', 'success');
          this.getScopeOfWork();
          this.scopeForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to add Scope', 'danger');
        },
      );
  }


  saveHazard() {
    const modalCloseBtn = document.getElementById('close-save-hazard');
    this.submitted = true;
    const payload = {
      'name': this.hazForm.get('name').value,
      'control': this.hazForm.get('control').value,
      'consequence': this.hazForm.get('consequence').value,
    };
    this.setupService.createHazard(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added the Hazard', 'success');
          this.getHazards();
          this.hazForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to add Hazard', 'danger');
        },
      );
  }


  saveCertificate() {
    const modalCloseBtn = document.getElementById('close-save-cert');
    this.submitted = true;
    const payload = {
      'name': this.certForm.get('name').value,
    };
    this.setupService.createCertificate(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the Certificate', 'success');
          this.getPPEs();
          this.certForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add Certificate', 'danger');
        },
      );
  }


  savePPE() {
    const modalCloseBtn = document.getElementById('close-save-ppe');
    this.submitted = true;
    const payload = {
      'name': this.ppeForm.get('name').value,
    };
    this.setupService.createPPE(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the PPE', 'success');
          this.getPPEs();
          this.ppeForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add PPE', 'danger');
        },
      );
  }

  saveSite() {
    const modalCloseBtn = document.getElementById('close-save-site');
    this.submitted = true;
    const payload = {
      'name': this.siteForm.get('name').value,
      'location': this.selectedLoc,

    };
    this.setupService.createSite(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the Site Name', 'success');
          this.getSites();
          this.siteForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add Site name', 'danger');
        },
      );
  }
  saveSSE() {
    const modalCloseBtn = document.getElementById('close-sse-names');
    this.submitted = true;
    const payload = {
      'name': this.sseForm.get('name').value,
    };
    this.setupService.createSiteSSE(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the SSE', 'success');
          this.getSSEs();
          this.sseForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add PPE', 'danger');
        },
      );
  }

  createAttendants() {
    const modalCloseBtn = document.getElementById('close-save-attendant');
    this.submitted = true;
    const payload = {
      'firstname': this.attendantForm.get('firstname').value,
      'lastname': this.attendantForm.get('lastname').value,
      'phone_number': this.attendantForm.get('phone_number').value,
      'id_number': this.attendantForm.get('id_number').value,
    };
    this.setupService.createAttendees(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          this.getAttendees();
          this.attendantForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }

  createLocation() {
    this.submitted = true;
    const payload = {
      'name': this.LocDetails,
      'latitude': this.latitude,
      'longitude': this.longitude,
    };
    const modalCloseBtn = document.getElementById('close-save-location');

    this.setupService.createLocation(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a location', 'success');
          this.getLocations();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Error', 'danger');
        },
      );
  }

  placeChangedCallback(location: google.maps.places.PlaceResult) {
    this.LocDetails = location.formatted_address;
    this.latitude = location.geometry.location.lat();
    this.longitude = location.geometry.location.lng();
  }

  saveDepartment() {
    const modalCloseBtn = document.getElementById('close-save-dept');
    this.submitted = true;
    const payload = {
      'name': this.depForm.get('name').value,
      'teams': this.selectedTeam,
      'division': this.selectedDiv,
    };
    this.setupService.createDepartment(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.depForm.reset();
          this.showToast('You have successfully Added a department', 'success');
          this.getDepartments();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add Department', 'danger');
        },
      );
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  openAttendants(dialog1: TemplateRef<any>) {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
   }

  openLocationForm(dialog2: TemplateRef<any>) {
    this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
  }

  openScopeForm(dialog3: TemplateRef<any>) {
    this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
  }

  openDepartmentForm(dialog4: TemplateRef<any>) {
    this.dialogService.open(dialog4, { context: 'this is some additional data passed to dialog' });
  }

  openHazform(dialog5: TemplateRef<any>) {
    this.dialogService.open(dialog5, { context: 'this is some additional data passed to dialog' });
  }
  openSiteform(dialog6: TemplateRef<any>) {
    this.dialogService.open(dialog6, { context: 'this is some additional data passed to dialog' });
  }

  openCertModal(dialog7: TemplateRef<any>) {
      this.dialogService.open(dialog7, { context: 'this is some additional data passed to dialog' });
     }
  openPPEModal(dialog8: TemplateRef<any>) {
      this.dialogService.open(dialog8, { context: 'this is some additional data passed to dialog' });
  }
  openSSEModal(dialog9: TemplateRef<any>) {
      this.dialogService.open(dialog9, { context: 'this is some additional data passed to dialog' });
  }

  deleteHazard(haz) {
    const x = confirm('Are you sure you want to delete this Hazard?');
    if (x) {
      this.setupService.deleteHazard(haz.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Hazard `, 'success');
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

  deleteAttendees(att) {
    const x = confirm('Are you sure you want to delete this Attendee?');
    if (x) {
      this.setupService.deleteAttendees(att.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Attendee `, 'success');
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
  deleteScope(scope) {
    const x = confirm('Are you sure you want to delete this Scope?');
    if (x) {
      this.setupService.deleteScope(scope.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the scope `, 'success');
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
  deleteLocation(loc) {
    const x = confirm('Are you sure you want to delete this Location?');
    if (x) {
      this.setupService.deleteLocation(loc.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Location `, 'success');
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
  deleteSite(site) {
    const x = confirm('Are you sure you want to delete this site name?');
    if (x) {
      this.setupService.deleteSiteNames(site.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the site name `, 'success');
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
  deleteDepartment(dep) {
    const x = confirm('Are you sure you want to delete this department');
    if (x) {
      this.setupService.deleteHazard(dep.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the department `, 'success');
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
  deletePPE(ppe) {
    const x = confirm('Are you sure you want to delete this PPE name?');
    if (x) {
      this.setupService.deleteHazard(ppe.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the PPE name `, 'success');
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
  deleteSSE(sse) {
    const x = confirm('Are you sure you want to delete this SSE name?');
    if (x) {
      this.setupService.deleteHazard(sse.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the SSE name `, 'success');
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

  deleteCERT(cert) {
    const x = confirm('Are you sure you want to delete this certificate name?');
    if (x) {
      this.setupService.deleteHazard(cert.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the certificate name `, 'success');
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

  editScope() {
    const modalCloseBtn = document.getElementById('close-edit-scope');
    this.submitted = true;
    const payload = {
      'name': this.scopeEditForm.get('name').value,
      'risk': this.scopeEditForm.get('risk').value,
      'department': this.selectedDep,
      'hazards': this.scopeEditForm.get('hazards').value,
      'activity': this.scopeEditForm.get('activity').value,
      'created_by': this.loggedInUser.id,
    };
    this.setupService.editScope(this.selectedScope.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edit the Scope', 'success');
          this.getScopeOfWork();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Scope', 'danger');
        },
      );
  }


  editHazard() {
    const modalCloseBtn = document.getElementById('close-edit-hazard');
    this.submitted = true;
    const payload = {
      'name': this.hazEditForm.get('name').value,
      'control': this.hazEditForm.get('control').value,
      'consequence': this.hazEditForm.get('consequence').value,
    };
    this.setupService.editHazard(this.selectedHazard.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Hazard', 'success');
          this.getHazards();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Hazard', 'danger');
        },
      );
  }


  editCertificate() {
    const modalCloseBtn = document.getElementById('close-edit-cert');
    this.submitted = true;
    const payload = {
      'name': this.certEditForm.get('name').value,
    };
    this.setupService.editCertificate(this.selectedcertificatesnames.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Certificate', 'success');
          this.getPPEs();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Certificate', 'danger');
        },
      );
  }


  editPPE() {
    const modalCloseBtn = document.getElementById('close-edit-ppe');
    this.submitted = true;
    const payload = {
      'name': this.ppeEditForm.get('name').value,
    };
    this.setupService.editPPE(this.selectedppenames.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the PPE', 'success');
          this.getPPEs();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit PPE', 'danger');
        },
      );
  }

  editSite() {
    const modalCloseBtn = document.getElementById('close-edit-site');
    this.submitted = true;
    const payload = {
      'name': this.siteEditForm.get('name').value,
      'location': this.selectedLoc,

    };
    this.setupService.editSites(this.selectedSites.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edit the Site Name', 'success');
          this.getSites();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add edit name', 'danger');
        },
      );
  }
  editSSE() {
    const modalCloseBtn = document.getElementById('close-edit-names');
    this.submitted = true;
    const payload = {
      'name': this.sseEditForm.get('name').value,
    };
    this.setupService.editSiteSSE(this.selectedssenames.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the SSE', 'success');
          this.getSSEs();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit PPE', 'danger');
        },
      );
  }

  editAttendants() {
    const modalCloseBtn = document.getElementById('close-edit-attendant');
    this.submitted = true;
    const payload = {
      'firstname': this.attendantEditForm.get('firstname').value,
      'lastname': this.attendantEditForm.get('lastname').value,
      'phone_number': this.attendantEditForm.get('phone_number').value,
      'id_number': this.attendantEditForm.get('id_number').value,
    };
    this.setupService.editAttendees(this.selectedAttendants.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited an attendant', 'success');
          this.getAttendees();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit attendant', 'danger');
        },
      );
  }

  editLocation() {
    this.submitted = true;
    const payload = {
      'name': this.LocDetails,
      'latitude': this.latitude,
      'longitude': this.longitude,
    };
    const modalCloseBtn = document.getElementById('close-edit-location');

    this.setupService.editLocation(this.selectedLocations.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a location', 'success');
          this.getLocations();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Error', 'danger');
        },
      );
  }

  editDepartment() {
    const modalCloseBtn = document.getElementById('close-edit-dept');
    this.submitted = true;
    const payload = {
      'name': this.depEditForm.get('name').value,
      'teams': this.selectedTeam,
      'division': this.selectedDiv,
    };
    this.setupService.editDepartment(this.selectedDepartments.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have edited Added a department', 'success');
          this.getDepartments();
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to edit Department', 'danger');
        },
      );
  }
  openEditAttendants(attend, dialog10: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog10, { context: 'this is some additional data passed to dialog' });
    }, 1000);
    this.selectedAttendants = attend;
    this.changeAttendee(attend);

  }

  openEditLocationForm(loc, dialog11: TemplateRef<any>) {
    this.dialogService.open(dialog11, { context: 'this is some additional data passed to dialog' });
    this.selectedLocations = loc;
    this.changeLocation(loc);
  }

  openEditScopeForm(scope, dialog12: TemplateRef<any>) {
    this.dialogService.open(dialog12, { context: 'this is some additional data passed to dialog' });
    this.selectedScope = scope;
    this.changeScope(scope);
  }

  openEditDepartmentForm(dep, dialog13: TemplateRef<any>) {
    this.dialogService.open(dialog13, { context: 'this is some additional data passed to dialog' });
    this.loadTeams();
    this.loadDivisions();
    this.selectedDepartments = dep;
    this.changeDepartment(dep);
  }

  openEditHazform(haz, dialog14: TemplateRef<any>) {
    this.dialogService.open(dialog14, { context: 'this is some additional data passed to dialog' });
    this.selectedHazard = haz;
    this.changeHazard(haz);
  }
  openEditSiteform(sites, dialog15: TemplateRef<any>) {
    this.dialogService.open(dialog15, { context: 'this is some additional data passed to dialog' });
    this.selectedSites = sites;
    this.changeSite(sites);
  }

  openEditCertModal(certs, dialog16: TemplateRef<any>) {
    this.dialogService.open(dialog16, { context: 'this is some additional data passed to dialog' });
    this.selectedcertificatesnames = certs;
    this.changeCert(certs);
  }
  openEditPPEModal(ppe, dialog17: TemplateRef<any>) {
    this.dialogService.open(dialog17, { context: 'this is some additional data passed to dialog' });
    this.selectedppenames = ppe;
    this.changePPE(ppe);
  }
  openEditSSEModal(sse, dialog18: TemplateRef<any>) {
    this.dialogService.open(dialog18, { context: 'this is some additional data passed to dialog' });
    this.selectedssenames = sse;
    this.changeSSE(sse);
  }
  changeScope(scope: Scope) {
    this.scopeEditForm.patchValue({
      'name': scope.name,
      'risk': scope.risk,
      'department': scope.department === null ? '' : scope.department.id,
      'activity': scope.activity,
      'hazard': scope.hazard,
    });
  }

  changeLocation(loc: Location) {
    this.locEditForm.patchValue({
      'name': loc.name,
      'latitude': loc.latitude,
      'longitude': loc.longitude,
    });
  }

  changeHazard(haz: Hazard) {
    this.hazEditForm.patchValue({
      'name': haz.name,
      'consequence': haz.consequence,
      'control': haz.control,
    });
  }

  changeAttendee(attendee: Attendants) {
    this.attendantEditForm.patchValue({
      'firstname': attendee.firstname,
      'lastname': attendee.lastname,
      'phone_number': attendee.phone_number,
      'id_number': attendee.id_number,
    });
  }

  changeDepartment(dep: Departments) {
    this.depEditForm.patchValue({
      'name': dep.name,
      'division': dep.division === null ? '' : dep.division.id,
      'teams': dep.teams === null ? '' : dep.teams.id,
    });
  }
  changeSite(site: Sites) {
    this.siteEditForm.patchValue({
      'name': site.name,
      'location': site.location === null ? '' : site.location.id,
    });
  }
  changePPE(ppe: PPEnames) {
    this.ppeEditForm.patchValue({
      'name': ppe.name,
    });
  }
  changeSSE(sse: SSEnames) {
    this.sseEditForm.patchValue({
      'name': sse.name,
    });
  }
  changeCert(cert: CertNames) {
    this.certEditForm.patchValue({
      'name': cert.name,
    });
  }

  flush() {
    this.locForm.reset();
    this.depForm.reset();
    this.scopeForm.reset();
    this.hazForm.reset();
    this.attendantForm.reset();
    this.ppeForm.reset();
    this.sseForm.reset();
    this.siteForm.reset();

  }
}
