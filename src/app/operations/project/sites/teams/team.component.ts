import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NbDialogService, NbToastrService, NbComponentStatus } from '@nebular/theme';
import { OrganizationService } from '../../../../@core/services/organization.service';
import { takeWhile } from 'rxjs/operators';
import { SiteService } from '../../../../@core/services/site.service';
import { FileService } from '../../../../@core/services/files.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { environment } from '../../../../../environments/environment';
import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';


@Component({
  selector: 'ngx-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss', './card.css'],
})

export class TeamComponent implements OnInit, OnDestroy {

  alive = true;
  userToken = localStorage.getItem('currentUserToken');
  loggedInUser;

  site;
  weatherLocation;
  siteId;
  siteTeams = [];
  teams = [];
  submitted = false;

  files = [];
  erpFile: File = null;
  public weatherData: any;
  casuals: any = [];

  private url = environment.WEATHER_URL;


  public casualElements = [
    'ID',
    'NAME',
    'ID. NO',
    'CONTACT. NO',
    'DATE ADDED',
  ];

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private orgService: OrganizationService,
    private dialogService: NbDialogService,
    private router: Router,
    protected location: Location,
    private fileService: FileService,
    private toastr: NbToastrService,
    private http: HttpClient,
  ) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.siteId = +this.route.snapshot.paramMap.get('id');
    this.getSite();
  }

  ngOnInit() {
    this.fileService.refresh$.subscribe(
      () => {
        this.getFiles();
      },
    );
    this.getFiles();
  }

  getSite() {
    this.siteService.fetchOneSite(this.siteId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.site = data;
          this.weatherLocation = data.location.name;
          this.getTeams(this.siteId);
          this.http.get(this.url +
            this.weatherLocation)
            .subscribe((weatherdata => {
              this.weatherData = weatherdata;
            }));
        },
      );
  }


  getTeams(id) {
    this.orgService.fetchSelectTeams(id)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.teams = data.results;
        },
      );
  }


  getFiles() {
    this.fileService.fetchFiles()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.files = data.results.filter(item => {
            return item.site === this.siteId;
          });
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
    formData.append('site', this.site.id);

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
          this.showToast(error.error.errors.name, 'danger');
        },
      );
  }

  getBinder() {
    this.fileService.fetchBinder(this.siteId)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        res => {
          const doc = new jsPDF();
          // let imgData;

          // html2canvas({
          //   useCORS: true,
          //   onrendered: function(canvas) {
          //     imgData = canvas.toDataUrl('image')
          //   },
          // });
          res.results[0].projects[this.siteId].files.forEach(item => {
            const img = 'item.file';
            doc.textWithLink('File', 10, 10, { url: item.file });
            doc.text(item.name, 10, 20);
            doc.addImage(img, 'JPEG', 15, 40, 180, 160);
          });
          doc.save('report.pdf');
        },
      );
  }

  viewDetails(team) {
    this.router.navigate([`/operations/tasks/${this.site.id}/${team.id}`]);
  }

  uploadFile(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  back() {
    this.location.back();
    return false;
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
