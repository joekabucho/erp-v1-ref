import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import {NbComponentStatus, NbDialogService, NbToastrService} from '@nebular/theme';
import {ResourceService} from '../../@core/services/ohs-resource.service';
import {HttpErrorResponse} from '@angular/common/http';
import {takeWhile} from 'rxjs/operators';
import {UserService} from '../../@core/services/user.service';
import {faFileImage, faFilePdf, faPlusCircle, faMinusCircle} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'ngx-document',
  styleUrls: ['./document.component.scss'],
  templateUrl: './document.component.html',
})
export class DocumentComponent implements OnInit, OnDestroy {

  alive = true;

  docForm: FormGroup;
  submitted: boolean;
  siteForm: FormGroup;

  // keywordTicket = 'ticket_code';
  // keywordSO = 'first_name';
  // keywordTechnician = 'first_name';
  // keywordSSE = 'name';
  // keywordPPE = 'name';
  // keywordCert = 'name';
  // keywordSite = 'name';


  public ppeElements = [
    'ID',
    'PPE NAMES',
    'SAFETY OFFICER',
    'TECHNICIAN',
    'TICKET',
    'FILE',
    'EDIT',
    'REMOVE',
  ];
  public sseElements = [
    'ID',
    'NAME',
    'TICKET',
    'SITE',
    'SAFETY OFFICER',
    'FILE',
    'EDIT',
    'REMOVE',
  ];
  public permitsElements = [
    'ID',
    'NAME',
    'EDIT',
    'REMOVE',
  ];

  public certificateElements = [
    'ID',
    'CERTIFICATE',
    'TECHNICIAN',
    'FILE',
    'EDIT',
    'REMOVE',
  ];


  permits = [];
  certificates = [];
  ppe = [];
  sse = [];
  certificatesnames = [];
  ppenames = [];
  allppenames = [];
  ssenames = [];
  Technicians = [];
  safetyOfficer = [];
  tickets = [];
  Site = [];
  pdf = faFilePdf;
  image = faFileImage;
  plus = faPlusCircle;
  minus = faMinusCircle;

  pdfSrc: any;


  ppeNamesSelected: any [] = [];
  fileExtensions: any;

  searchPPE: any;
  searchCert: any;
  searchPermit: any;
  searchSSE: any;
  itemsPerPage: number;



  sseFile: File = null;
  ppeFile: File = null;
  certificatesFile: File = null;

  selectedPPEFile: any;
  selectedCertFile: any;
  selectedSSEFile: any;
  public ppeForm: FormGroup;
  imageToView: any;
  public sseForm: FormGroup;
  public certForm: FormGroup;
  public Location = [];

  // public selectedTicket: any;
  // private selectedSO: any;
  // public selectedTechnician: any;
  // private selectedSSE: any;
  // private selectedPPE: any;
  // private selectedCert: any;
  // private selectedSite: any;


  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,
    private resourceService: ResourceService,
    private toastr: NbToastrService,
    private userService: UserService,

  ) {
    this.docForm = this.fb.group({
      'name': [null, Validators.required],
    });
    this.siteForm = this.fb.group({
      'name': [null, Validators.required],
      'location': [null, Validators.required],
    });
    this.ppeForm = this.fb.group({
      ppe_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        technician: [null, Validators.required],
        safety_officer: [null, Validators.required],
        ticket: [null, Validators.required],
        ppe_names: [null, Validators.required]})]),
    });
    this.sseForm = this.fb.group({
      sse_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        safety_officer: [null, Validators.required],
        site: [null, Validators.required],
        ticket: [null, Validators.required],
        name: [null, Validators.required]})]),
    });
    this.certForm = this.fb.group({
      cert_items: this.fb.array([this.fb.group({
        file: ['' , Validators.required],
        technician: [null, Validators.required],
        certificate: [null, Validators.required]})]),
    });
  }

  ngOnInit() {
    this.itemsPerPage = 25;
    this.resourceService.refresh$.subscribe(
      () => {
        this.getPermits();
        this.getCertificates();
        this.getPPEs();
        this.getSSEs();
      },
    );
    this.getPermits();
    this.getCertificates();
    this.getPPEs();
    this.getSSEs();

    /* Initiate the form structure */
  }

  // selectedTicketID(item) {
  //   // do something with selected item
  //   this.selectedTicket = item.id;
  // }
  // selectSO(item) {
  //   // do something with selected item
  //   this.selectedSO = item.id;
  // }
  // selectTechnician(item) {
  //   // do something with selected item
  //   this.selectedTechnician = item.id;
  // }
  // selectTPPE(item) {
  //   // do something with selected item
  //   this.selectedPPE = item.id;
  // }
  // selectSSE(item) {
  //   // do something with selected item
  //   this.selectedSSE = item.id;
  // }
  // selectCert(item) {
  //   // do something with selected item
  //   this.selectedCert = item.id;
  // }
  // selectSite(item) {
  //   // do something with selected item
  //   this.selectedSite = item.id;
  // }
  //
  // onFocusedTickets(e) {
  //   // do something when input is focused
  //   this.loadTickets();
  // }
  // onFocusedSo(e) {
  //   // do something when input is focused
  //   this.getAllUsers();
  // }
  // onFocusedTechnician(e) {
  //   // do something when input is focused
  //   this.getAllUsers();
  // }
  // onFocusedPPE(e) {
  //   // do something when input is focused
  //   this.getPPENames();
  // }
  // onFocusedSSE(e) {
  //   // do something when input is focused
  //   this.getSSENames();
  // }
  // onFocusedCert(e) {
  //   // do something when input is focused
  //   this.getCertificates();
  // }
  // onFocusedSite(e) {
  //   // do something when input is focused
  //   this.loadSites();
  // }
  // onChangeSearch(val: string) {
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  // }
  ///////// This is new ////////
  get ppeItems() {
    return this.ppeForm.get('ppe_items') as FormArray;
  }

  addPpeItems() {
    this.ppeItems.push(this.fb.group({
      file: [''],
      technician: [null, Validators.required],
      safety_officer: [null, Validators.required],
      ticket: [null, Validators.required],
      ppe_names: [null, Validators.required],
    }));
  }

  deletePpeItems(index) {
    this.ppeItems.removeAt(index);
  }

  get sseItems() {
    return this.sseForm.get('sse_items') as FormArray;
  }

  addSseItems() {
    this.sseItems.push(this.fb.group({
      file: [''],
      safety_officer: [null, Validators.required],
      site: [null, Validators.required],
      ticket: [null, Validators.required],
      name: [null, Validators.required],
    }));
  }

  deleteSseItems(index) {
    this.sseItems.removeAt(index);
  }

  get certItems() {
    return this.certForm.get('cert_items') as FormArray;
  }

  addCertItems() {
    this.certItems.push(this.fb.group({
      file: [''],
      technician: [null, Validators.required],
      certificate: [null, Validators.required],
    }));
  }

  deleteCertItems(index) {
    this.certItems.removeAt(index);
  }

  //////////// End ////////////////////


  // Permits

  getPermits() {
    this.resourceService.fetchPermits(this.itemsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.permits = data.results;
        },
      );
  }

  fetchPermitDetails() {
    this.resourceService.searchPermit(this.searchPermit)
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      data => {
        this.permits = data.results;
      },
    );
  }


  onChangePermit(event: any) {
    this.itemsPerPage = event;
    this.getPermits();
  }

  // Certificate
  getCertificates() {
    this.resourceService.fetchTechnicianCertificate(this.itemsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.certificates = data.results;
        },
      );
  }

  fetchCertDetails() {
    this.resourceService.searchTechnicianCertificate(this.searchCert)
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      data => {
        this.certificates = data.results;
      },
    );
  }


  onChangeCert(event: any) {
    this.itemsPerPage = event;
    this.getCertificates();
  }


  // PPE
  getPPEs() {
    this.resourceService.fetchSitePPE(this.itemsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppe = data.results;
        },
      );
  }

  fetchPPEDetails() {
    this.resourceService.searchSitePPE(this.searchPPE)
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      data => {
        this.ppe = data.results;
      },
    );
  }


  onChangePPE(event: any) {
    this.itemsPerPage = event;
    this.getPPEs();
  }

  // SSE
  getSSEs() {
    this.resourceService.fetchSSEFiles(this.itemsPerPage)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.sse = data.results;
        },
      );
  }


  fetchSSEDetails() {
    this.resourceService.searchSiteSSE(this.searchSSE)
    .pipe(takeWhile(() => this.alive))
    .subscribe(
      data => {
        this.sse = data.results;
      },
    );
  }


  onChangeSSE(event: any) {
    this.itemsPerPage = event;
    this.getSSEs();
  }



  getCertificateNames() {
    this.resourceService.fetchCertificate(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.certificatesnames = data.results;
        },
      );
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Technicians = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN';
          }
        });
        this.safetyOfficer = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
      });
  }

  getPPENames() {
    this.resourceService.fetchPPE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppenames = data.results;
        },
      );
  }

  getSSENames() {
    this.resourceService.fetchSiteSSE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ssenames = data.results;
        },
      );
  }

  savePermit() {
    const modalCloseBtn = document.getElementById('close-perm');
    this.submitted = true;
    const payload = {
      'name': this.docForm.get('name').value,
    };
    this.resourceService.createPermit(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the Permit', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add Permit', 'danger');
        },
      );
  }

  saveCertificate() {
    const modalCloseBtn = document.getElementById('close-cert');
    this.submitted = true;
    const payload = {
      'name': this.docForm.get('name').value,
    };
    this.resourceService.createCertificate(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the Certificate', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add Certificate', 'danger');
        },
      );
  }


  savePPE() {
    const modalCloseBtn = document.getElementById('close-ppe-names');
    this.submitted = true;
    const payload = {
      'name': this.docForm.get('name').value,
    };
    this.resourceService.createPPE(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the PPE', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add PPE', 'danger');
        },
      );
  }
  saveSSE() {
    const modalCloseBtn = document.getElementById('close-sse-names');
    this.submitted = true;
    const payload = {
      'name': this.docForm.get('name').value,
    };
    this.resourceService.createSiteSSE(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully Added the PPE', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          // modalCloseBtn.click();
          this.showToast('Unable to Add PPE', 'danger');
        },
      );
  }


  confirmDeletePPE(item) {
    const x = confirm('Are you sure you want to delete this PPE?');
    if (x) {
      this.resourceService.deletePPEFile(item.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the PPE`, 'success');
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


  confirmDeletePermit(perm) {
    const x = confirm('Are you sure you want to delete this permit?');
    if (x) {
      this.resourceService.deletePermit(perm.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully deleted the permit`, 'success');
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


  confirmDeleteCertificate(cert) {
    const x = confirm('Are you sure you want to delete this Certificate?');
    if (x) {
      this.resourceService.deleteCertificateFile(cert.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully Deleted the Certificate`, 'success');
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
  loadTickets() {
    this.resourceService.fetchTickets(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.tickets = data.results;
        },
      );
  }

  loadSites() {
    this.resourceService.fetchSites()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Site = data.results;
        },
      );
  }
  confirmDeleteSSE(sse) {
    const x = confirm('Are you sure you want to delete this SSE?');
    if (x) {
      this.resourceService.deleteSSEFile(sse.id)
        .subscribe(
          () => {
            this.showToast(`You have successfully deleted the SSE`, 'success');
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

  onSSEFileUploadSelected(event) {
    this.sseFile = event.target.files[0] as File;
  }
  onPPEFileSelected(event) {
    this.ppeFile = event.target.files[0] as File;
  }
  onCertificateFileSelected(event) {
    this.certificatesFile = event.target.files[0] as File;
  }

  saveCertificateFile(certitems) {

    const modalCloseBtn = document.getElementById('close-certificate');
    const formData = new FormData;
    this.submitted = true;

    for (let j = 0; j <= certitems.cert_items.length - 1; j++) {
      formData.append('certificate', certitems.cert_items[j].certificate);
      formData.append('technician', certitems.cert_items[j].technician);
        formData.append('file', this.certificatesFile, this.certificatesFile.name);
      formData.append('file_type', this.certificatesFile.type);

      this.resourceService.createCertificateFile(formData)
        .subscribe(
          () => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast('You have successfully added a File', 'success');
          },
          (error: HttpErrorResponse) => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }
  editCertificateFile(fileForm) {
    const modalCloseBtn = document.getElementById('close-certificate');
    const formData = new FormData;
    this.submitted = true;

    formData.append('certificate', fileForm.certificate);
    formData.append('technician', fileForm.technician);
    formData.append('file', this.certificatesFile, this.certificatesFile.name);
    formData.append('file_type', this.certificatesFile.type);

    this.resourceService.editCertificateFiles(this.selectedCertFile.id, formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }
  savePPEFile(ppeitems) {
    const modalCloseBtn = document.getElementById('close-ppe');
    const formData = new FormData;
    this.submitted = true;

    for (let j = 0; j <= ppeitems.ppe_items.length - 1; j ++) {
      formData.append('ppe_names', ppeitems.ppe_items[j].ppe_names);
      formData.append('safety_officer', ppeitems.ppe_items[j].safety_officer),
        formData.append('ticket', ppeitems.ppe_items[j].ticket),
        formData.append('file', this.ppeFile, this.ppeFile.name);
      formData.append('file_type', this.ppeFile.type);
      formData.append('technician', ppeitems.ppe_items[j].technician);

      this.resourceService.createPPEFile(formData)
        .subscribe(
          () => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast('You have successfully added a File', 'success');
          },
          (error: HttpErrorResponse) => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }
  editPPEFile(fileForm) {
    const modalCloseBtn = document.getElementById('close-ppe');
    const formData = new FormData;
    this.submitted = true;

    formData.append('ppe_names', fileForm.ppe_names);
    formData.append('safety_officer', fileForm.safety_officer);
    formData.append('ticket', fileForm.ticket);
    formData.append('file', this.ppeFile, this.ppeFile.name);
    formData.append('file_type', this.ppeFile.type);


    this.resourceService.editPPEFiles(this.selectedPPEFile.id, formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  saveSSEFile(sseitems) {
    const modalCloseBtn = document.getElementById('close-sse');
    const formData = new FormData;
    this.submitted = true;

    for (let j = 0; j <= sseitems.sse_items.length - 1; j ++) {
      formData.append('name', sseitems.sse_items[j].name);
      formData.append('site', sseitems.sse_items[j].site);
        formData.append('ticket', sseitems.sse_items[j].ticket);
        formData.append('safety_officer', sseitems.sse_items[j].safety_officer);
      formData.append('file', this.sseFile, this.sseFile.name);
      formData.append('file_type', this.sseFile.type);
      this.resourceService.createSSEFile(formData)
        .subscribe(
          () => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast('You have successfully added a File', 'success');
          },
          (error: HttpErrorResponse) => {
            this.submitted = false;
            modalCloseBtn.click();
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }
  editSSEFile( fileForm) {
    const modalCloseBtn = document.getElementById('close-sse');
    const formData = new FormData;
    this.submitted = true;

    formData.append('name', fileForm.name);
    formData.append('ticket', fileForm.ticket);
    formData.append('site', fileForm.site);
    formData.append('safety_officer', fileForm.safety_officer);
    formData.append('file', this.sseFile, this.sseFile.name);
    formData.append('file_type', this.sseFile.type);


    this.resourceService.editSSEFiles(this.selectedSSEFile.id, formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast(error.error.errors.name, 'danger');
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
    this.resourceService.createSite(payload)
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

  openPermitModal(dialog: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openCertModal(dialog1: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    }, 1000);  }
  openPPEModal(dialog2: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openSSEModal(dialog9: TemplateRef<any>) {
    setTimeout(() => {
      this.dialogService.open(dialog9, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }

  openPPEFileModal(dialog3: TemplateRef<any>) {
    this.getAllUsers();
    this.getPPENames();
    this.loadTickets();
    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openSSEFileModal(dialog4: TemplateRef<any>) {
    this.getSSENames();
    this.loadTickets();
    this.getAllUsers();
    this.loadSites();
    setTimeout(() => {
      this.dialogService.open(dialog4, { context: 'this is some additional data passed to dialog' });
    }, 1000);
  }
  openCertFileModal(dialog5: TemplateRef<any>) {
    this.getCertificateNames();
    this.getAllUsers();
    this.dialogService.open(dialog5, { context: 'this is some additional data passed to dialog' });
  }

  openPDF(dialog10: TemplateRef<any>, pdf) {
    this.dialogService.open(dialog10, { context: 'this is some additional data passed to dialog' });
    this.pdfSrc = pdf.file;
  }
  openImage(dialog11: TemplateRef<any>, image) {
    this.dialogService.open(dialog11, { context: 'this is some additional data passed to dialog' });
    this.imageToView = image.file;
  }

  editPPEFileModal(dialog6: TemplateRef<any>, item) {
    this.getAllUsers();
    this.getPPENames();
    this.selectedPPEFile = item;
    this.dialogService.open(dialog6, { context: 'this is some additional data passed to dialog' });
  }
  editSSEFileModal(dialog7: TemplateRef<any>, item) {
    this.getSSENames();
    this.loadTickets();
    this.loadSites();
    this.getAllUsers();
    this.selectedSSEFile = item;
    this.dialogService.open(dialog7, { context: 'this is some additional data passed to dialog' });
  }
  editCertFileModal(dialog8: TemplateRef<any>, cert) {
    this.getCertificateNames();
    this.getAllUsers();
    this.selectedCertFile = cert;
    this.dialogService.open(dialog8, { context: 'this is some additional data passed to dialog' });
  }
  openSite(dialog12: TemplateRef<any>) {
    this.dialogService.open(dialog12, { context: 'this is some additional data passed to dialog' });
    this.loadLocations();
  }

  loadLocations() {
    return this.resourceService.fetchLocations().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Location = data.results;
      });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  ngOnDestroy() {
    this.alive = false;
  }
  identify(index, item) {
    return item.id;
  }
}
