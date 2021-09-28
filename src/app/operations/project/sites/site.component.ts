import { Component, TemplateRef, OnDestroy, OnInit} from '@angular/core';
import { SiteService } from '../../../@core/services/site.service';
import { UserService } from '../../../@core/services/user.service';
import { OrganizationService } from '../../../@core/services/organization.service';
import { NbDialogService, NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from '../../../@core/services/project.service';
import * as jwt_decode from 'jwt-decode';
import { FileService } from '../../../@core/services/files.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Site } from '../../../@core/models/site';
// import { MapsAPILoader } from '@agm/core';
// import  jsPDF  from 'jspdf';
// import html2canvas from 'html2canvas';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'ngx-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss', './style.css'],
})

export class SiteComponent implements OnInit, OnDestroy {
  // @ViewChild('content',{static : true}) content:ElementRef;
  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;
  project;
  projectId;
  sites = [];
  siteEditId;
  editSites = [];
  locations = [];
  searchTerm;
  siteManager = [];
  teams = [];
  checkedteams = [];
  checkedTeams = [];
  unCheckedTeams = [];
  selectedTeams = [];
  selectedSites = [];
  unselectedSites = [];
  setSites: any;
  isChecked;
  submitted = false;
  userDetails;
  noImage = null;
  files = [];
  erpFile: File = null;
  LocDetails: any = [];


  siteEditForm: FormGroup;
  selectedSite;

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  coordinates = [];
  long: any;
  zoom: any;
  address: string;
  // private geoCoder;
  // private placeName: any;
  teamsToInject = [];
  // public binderData:any = [];

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private projectService: ProjectService,
    private userService: UserService,
    private orgService: OrganizationService,
    private dialogService: NbDialogService,
    private toastr: NbToastrService,
    private router: Router,
    protected location: Location,
    private fileService: FileService,
    private fb: FormBuilder,
    public _DomSanitizer: DomSanitizer,
    // private mapsAPILoader: MapsAPILoader,
    // private ngZone: NgZone,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.projectId = +this.route.snapshot.paramMap.get('id');
    this.getSites();
  }

  ngOnInit() {
    // this.toDataURL('https://pbs.twimg.com/profile_images/558329813782376448/H2cb-84q_400x400.jpeg',
    //  function (dataUrl) {
    //   console.log(dataUrl)
    //       })
    this.siteService.refresh$.subscribe(
      () => {
        this.getSites();
        this.getLocations();
      },
    );
    this.fileService.refresh$.subscribe(
      () => {
        this.getFiles();
      },
    );
    this.getFiles();
    this.getLocations();
    this.getMarkers();
    this.setCurrentLocation();
    this.getTeams();
    // this.getBinder();
    this.siteEditForm = this.fb.group({
      name: ['', Validators.required],
      manager: ['', Validators.required],
      location: ['', Validators.required],
      date_started: ['', Validators.required],
    });

  }

  getSites() {
    this.siteService.fetchSpecificSites(this.projectId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.sites = data.results;
        },
      );
  }

  sendToLocalStorage(item) {
    localStorage.setItem('selectedSiteId', item);
  }
  getEditSites() {
    this.siteEditId = localStorage.getItem('selectedSiteId');
    const siteInt = parseInt(this.siteEditId, 10);
    this.siteService.fetchOneSite(siteInt)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.editSites = data.teams;
        },
      );
  }


  getProject() {
    this.projectService.fetchOneProject(this.projectId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.project = data;
        },
      );
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 7.5;
      });
    }
  }

  // getBinder() {
  //   this.fileService.fetchBinder(this.projectId)
  //     .pipe(takeWhile(() => this.alive))
  //     .subscribe(
  //       res => {
  //         res.results[0].projects[this.projectId].files.forEach(item => {
  //            this.binderData = item;
  //         });
  //       },
  //     );
  // }
//   toDataURL(url, callback) {
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         var reader = new FileReader();
//         reader.onloadend = function () {
//             callback(reader.result);
//         }
//         reader.readAsDataURL(xhr.response);
//     };
//     xhr.open('GET', url);
//     xhr.responseType = 'blob';
//     xhr.send();
// }
//   public convetToPDF()
// {
// var data = document.getElementById('contentToConvert');
// html2canvas(data).then(canvas => {
// // Few necessary setting options
// var imgWidth = 208;
// var pageHeight = 295;
// var imgHeight = canvas.height * imgWidth / canvas.width;
// var heightLeft = imgHeight;

// const contentDataURL = canvas.toDataURL('image/png')
// let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
// var position = 0;
// pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
// pdf.save('new-file.pdf'); // Generated PDF
// });
// }

  getFiles() {
    this.fileService.fetchFiles()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.files = data.results.filter(item => {
            return item.project === this.projectId;
          });
        },
      );
  }

  getLocations() {
    this.siteService.fetchLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.locations = data.results;
        },
      );
  }

  getMarkers() {
    this.siteService.fetchLocations()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        locs => {
          this.locations = locs.results;
          this.siteService.fetchSpecificSites(this.projectId)
            .pipe(takeWhile(() => this.alive))
            .subscribe(
              data => {
                this.sites = data.results;
                if (locs.results.name === data.results.name) {
                  this.coordinates = locs.results;
                }
              },
            );
        },
      );
  }

  getUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.siteManager = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'PROJECT MANAGER';
          }
        });
      });
  }

  getUserProfile(id) {
    this.userService.fetchOneProfile(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe((data) => {
        this.userDetails = data;
      });
  }

  getTeams() {
    this.orgService.fetchTeam()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.teams = data.results;
        },
      );
  }



  changed(evt, team) {
    this.isChecked = evt.target.checked;
    if (this.isChecked) {
      this.selectedTeams.push(team.id);
    } else {
      this.selectedTeams = this.selectedTeams.filter(t => {
        return t !== team.id;
      });
    }
  }


  saveSite(siteForm) {
    const modalCloseBtn = document.getElementById('close-site');
    this.submitted = true;

    const payload = {
      'name': siteForm.name,
      'location': siteForm.location,
      // 'latitude': siteForm.latitude,
      // 'longitude': siteForm.longitude,
      'manager': siteForm.manager,
      'date_started': siteForm.date_started,
      'project': this.projectId,
      'teams': this.selectedTeams,
      'created_by': this.loggedInUser.id,
    };

    this.siteService.createSite(payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          siteForm.resetForm();
          this.showToast('You have successfully added a Site', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          siteForm.resetForm();
          this.showToast('Error', 'danger');
        },
      );
  }


  editSite() {
    const modalCloseBtn = document.getElementById('close-edit');
    this.submitted = true;
    const payload = {
      'name': this.siteEditForm.get('name').value,
      'location': this.siteEditForm.get('location').value,
      'manager': this.siteEditForm.get('manager').value,
      'date_started': this.siteEditForm.get('date_started').value,
      'project': this.projectId,
      'teams': this.selectedTeams,
      'created_by': this.loggedInUser.id,
    };

    this.siteService.editSite(this.selectedSite.id, payload)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully edited the Site', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Unable to edit Site', 'danger');
        },
      );
  }

  openSiteEditForm(site, dialog3: TemplateRef<any>) {
    this.getUsers();
    this.getLocations();
    this.selectedSite = site;
    this.getEditSites();

    setTimeout(() => {
      this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    }, 1500);
    this.changeSite(site);
  }

  changeSite(site: Site) {
    this.siteEditForm.patchValue({
      name: site.name,
      manager: site.manager.id,
      location: site.location.id,
      date_started: site.date_started,
    });
    let i;
    for (i = 0; i < site.teams.length; i++) {
      this.selectedSites[i] = site.teams[i].id;
    }
    this.setSites = new Set(this.selectedSites);

    this.siteService.fetchTeams().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.unselectedSites = data.results.filter(
          x => !this.setSites.has(x.id),
        );
        this.selectedSites = data.results.filter(
          x => this.setSites.has(x.id),
        );
      });

  }


  confirmDelete(site) {
    const x = confirm('Are you sure you want to remove this Site?');
    if (x) {
      this.removeSite(site);
    } else {
      return false;
    }
  }


  removeSite(site) {
    this.siteService.deleteSite(site.id)
      .subscribe(
        () => {
          this.showToast(`You have successfully Removed the Site`, 'success');
          this.ngOnInit();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Operation unsuccessful', 'danger');
        },
      );
  }

  onErpFileSelected(event) {
    this.erpFile = event.target.files[0] as File;
  }

  saveFile(fileForm) {
    const modalCloseBtn = document.getElementById('close-file');
    const formData = new FormData;
    this.submitted = true;

    formData.append('name', this.erpFile.name);
    formData.append('upload_type', this.erpFile.type);
    formData.append('file', this.erpFile, this.erpFile.name);
    formData.append('comment', fileForm.comment);
    formData.append('posted_by', this.loggedInUser.id);
    formData.append('project', this.projectId);

    this.fileService.createFile(formData)
      .subscribe(
        () => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('You have successfully added a File', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          modalCloseBtn.click();
          this.showToast('Unable to save file', 'danger');
        },
      );
  }
  saveLocation() {
    this.submitted = true;
    const payload = {
      'name': this.LocDetails,
      'latitude': this.latitude,
      'longitude': this.longitude,
    };
    const modalCloseBtn = document.getElementById('close-location');

    this.userService.createLocation(payload)
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




  uploadFile(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  openSiteform(dialog: TemplateRef<any>) {
    this.getUsers();
    this.getLocations();
    this.getTeams();
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  openLocationForm(dialog3: TemplateRef<any>) {
    this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  viewDetails(site) {
    this.router.navigate([`/operations/teams/${site.id}`]);
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
