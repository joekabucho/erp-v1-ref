import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ProjectService } from '../../@core/services/project.service';
import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TaskService } from '../../@core/services/task.service';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import * as jwt_decode from 'jwt-decode';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Service } from '../../@core/models/service';
// import { Kpis } from '../../@core/models/kpi';
import { KpiService} from '../../@core/services/kpi.service';
import { SiteService } from '../../@core/services/site.service';
import { UserService } from '../../@core/services/user.service';


@Component({
    selector: 'ngx-client',
    templateUrl: './client-service.component.html',
    styleUrls: ['./client-service.component.scss'],
})
export class ClientComponent implements OnInit, OnDestroy {

    alive = true;
    userToken = localStorage.getItem('currentUserToken');
    loggedInUser;
    clients = [];
    services = [];
    kpis = [];
    submitted = false;
    selectedService;
    serviceEditForm: FormGroup;
    latitude: number;
    longitude: number;
    LocDetails: any = [];
    locations = [];


    constructor(
        private projectService: ProjectService,
        private taskService: TaskService,
        private kpiService: KpiService,
        private toastr: NbToastrService,
        private dialogService: NbDialogService,
        private fb: FormBuilder,
        private siteService: SiteService,
        private userService: UserService,
    ) {
        this.loggedInUser = jwt_decode(this.userToken);
    }

    ngOnInit() {
        this.projectService.refresh$.subscribe(
            () => {
                this.getClients();
                this.getServices();
            },
        );
        this.taskService.refresh$.subscribe(
            () => {
                this.getKPIs();
            },
        );
        this.getClients();
        this.getServiceKPIs();
        this.getServices();
        this.getLocations();
        this.serviceEditForm = this.fb.group({
            name: ['', Validators.required],
            kpi: ['', Validators.required],
        });
    }

    getClients() {
        this.projectService.fetchClient()
            .pipe(takeWhile(() => this.alive))
            .subscribe(
                data => {
                    this.clients = data.results;
                },
            );
    }

    getServices() {
        this.projectService.fetchService()
            .pipe(takeWhile(() => this.alive))
            .subscribe(
                data => {
                    this.services = data.results;
                },
            );
    }

    getKPIs() {
        this.taskService.fetchKPI()
            .pipe(takeWhile(() => this.alive))
            .subscribe(
                data => {
                    this.kpis = data.results;
                },
            );
    }
  getServiceKPIs() {
    this.kpiService.fetchServiceKPI()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.kpis = data.results;
        },
      );
  }

    saveClient(clientForm) {
        const payload = {
            'name': clientForm.name,
        };
        this.submitted = true;
        const modalCloseBtn = document.getElementById('close-client');

        this.projectService.createClient(payload)
            .subscribe(
                () => {
                    this.submitted = false;
                    modalCloseBtn.click();
                    this.showToast('You have successfully added a client', 'success');
                },
                (error: HttpErrorResponse) => {
                    this.submitted = false;
                    modalCloseBtn.click();
                    this.showToast(error.error.errors.name, 'danger');
                },
            );
    }

    saveService(serviceForm) {
        const payload = {
            'name': serviceForm.name,
        };
        this.submitted = true;
        const modalCloseBtn = document.getElementById('close-service');
        this.projectService.createService(payload)
            .subscribe(
                () => {
                    this.submitted = false;
                    modalCloseBtn.click();
                    this.showToast('You have successfully added a Service', 'success');
                },
                (error: HttpErrorResponse) => {
                    this.submitted = false;
                    modalCloseBtn.click();
                    this.showToast(error.error.errors.name, 'danger');
                },
            );
    }

  saveServiceKPI(kpiServiceForm) {
    this.submitted = true;

    const payload = {
      'service': kpiServiceForm.service,
      'name': kpiServiceForm.name,
      'number_of_days': kpiServiceForm.number_of_days,
    };

    this.kpiService.createKPI(payload)
      .subscribe(
        () => {
          this.submitted = false;
          this.showToast('You have successfully added a KPI to a service', 'success');
        },
        (error: HttpErrorResponse) => {
          this.submitted = false;
          this.showToast('Error', 'danger');
        },
      );
  }


    confirmServiceDelete(serve) {
        const x = confirm('Are you sure you want to remove this Service?');
        if (x) {
            this.removeService(serve);
        } else {
            return false;
        }
    }

    removeService(serve) {
        this.projectService.deleteService(serve.id)
            .subscribe(
                () => {
                    this.showToast(`You have successfully Removed the Service`, 'success');
                    this.ngOnInit();
                },
                (error: HttpErrorResponse) => {
                    this.showToast('Operation unsuccessful', 'danger');
                },
            );
    }


    confirmClientDelete(client) {
        const x = confirm('Are you sure you want to remove this Client?');
        if (x) {
            this.removeClient(client);
        } else {
            return false;
        }
    }

    removeClient(client) {
        this.projectService.deleteClient(client.id)
            .subscribe(
                () => {
                    this.showToast(`You have successfully Removed the Client`, 'success');
                    this.ngOnInit();
                },
                (error: HttpErrorResponse) => {
                    this.showToast('Operation unsuccessful', 'danger');
                },
            );
    }

    showToast(message, status: NbComponentStatus) {
        this.toastr.show(message, `Hi there!`, { status });
    }

    openClient(dialog: TemplateRef<any>) {
        this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
    }

    openService(dialog1: TemplateRef<any>) {
        this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
    }

    openEditForm(service, dialog2: TemplateRef<any>) {
        this.getKPIs();
        this.selectedService = service;

        setTimeout(() => {
            this.dialogService.open(dialog2, { context: 'this is some additional data passed to dialog' });
        }, 1000);
        this.changeService(service);
    }

  openKPIs(dialog3: TemplateRef<any>) {
    this.dialogService.open(dialog3, { context: 'this is some additional data passed to dialog' });
    this.getServices();
  }

    changeService(service: Service) {
        this.serviceEditForm.patchValue({
            name: service.name,
            kpi: service.kpi.id,
        });

    }

    editService() {
        const modalCloseBtn = document.getElementById('close-edit');
        this.submitted = true;
        const payload = {
            'name': this.serviceEditForm.get('name').value,
            'kpi': this.serviceEditForm.get('kpi').value,
        };

        this.projectService.editService(this.selectedService.id, payload)
            .subscribe(
                () => {
                    this.submitted = false;
                    modalCloseBtn.click();
                    this.showToast('You have successfully edited the Service', 'success');
                },
                (error: HttpErrorResponse) => {
                    this.showToast('Unable to edit Project', 'danger');
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

    confirmLocationDelete(loc) {
        const x = confirm('Are you sure you want to remove this Location?');
        if (x) {
            this.removeLocation(loc);
        } else {
            return false;
        }
    }

    removeLocation(loc) {
        this.userService.deleteLocation(loc.id)
            .subscribe(
                () => {
                    this.showToast(`You have successfully Removed the Location`, 'success');
                    this.ngOnInit();
                },
                (error: HttpErrorResponse) => {
                    this.showToast('Operation unsuccessful', 'danger');
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

    openLocationForm(dialog4: TemplateRef<any>) {
      this.dialogService.open(dialog4, { context: 'this is some additional data passed to dialog' });
    }

    ngOnDestroy() {
        this.alive = false;
    }
}
