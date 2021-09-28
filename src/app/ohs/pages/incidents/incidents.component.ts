import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { IncidentsService } from '../../../@core/services/incident.service';
import {JobIncidents} from '../../../@core/models/incidents';
import {Location} from '@angular/common';
import { IncidentCreateModalComponent } from '../incident-create-modal/incident-create-modal.component';
import { IncidentEditComponent } from '../incident-edit/incident-edit.component';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'ngx-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss'],
})
export class IncidentsComponent implements OnInit {
  alive = true;

  public incident = [];
  data: JobIncidents;
  public SelectedIncidentTicket: number;


  constructor(    public  incidentsService: IncidentsService,
                  protected _location: Location,
                  public modalCtrl: ModalController,


  ) {}

  ngOnInit() {
    this.incidentsService.refresh$.subscribe(
      () => {
        this.getIncident(null);
      },
    );
  this.getIncident(null);
}
  getIncident(event) {
    let incidentInt;
    incidentInt = localStorage.getItem('selectedTicket');
    this.SelectedIncidentTicket = +incidentInt;
    this.incidentsService.fetchIncidentsByTicket(this.SelectedIncidentTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.incident = data.results;
          if (event)
            event.target.complete();
        },
      );
  }
  identify(index, item) {
    return item.id;
  }

  back() {
    this._location.back();
    return false;
  }
  async showModal() {
    const modal = await this.modalCtrl.create({
      component: IncidentCreateModalComponent,
    });
    return await modal.present();
  }
  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: IncidentEditComponent,
    });
    localStorage.setItem('incident', id);
    return await modal.present();
  }

}
