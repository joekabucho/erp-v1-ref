import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { HazardService } from '../../../@core/services/hazard.service';
import {Hazard} from '../../../@core/models/hazard';
import {Location} from '@angular/common';
import {JhaEditComponent } from '../../pages/jha-edit/jha-edit.component';
import {JhaCreateModalComponent } from '../../pages/jha-create-modal/jha-create-modal.component';

import { ModalController} from '@ionic/angular';



@Component({
  selector: 'ngx-jha',
  templateUrl: './jha.component.html',
  styleUrls: ['./jha.component.scss'],
})
export class JhaComponent implements OnInit {

  alive = true;

  public hazard = [];
  data: Hazard;
  public SelectedIncidentTicket: number;
  public SelectedHazTicket: number;
  constructor( public  hazardService: HazardService,
               protected _location: Location,
               public modalCtrl: ModalController,
) { }

  ngOnInit() {
    this.hazardService.refresh$.subscribe(
      () => {
        this.getJha();
      },
    );
    this.getJha();
  }
  getJha() {
    let hazInt;
    hazInt = localStorage.getItem('selectedTicket');
    this.SelectedHazTicket = +hazInt;
    this.hazardService.fetchHazardAnalysisByTicket(this.SelectedHazTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazard = data.results;
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
      component: JhaCreateModalComponent,
    });
    return await modal.present();
  }

  async showEdit(id) {
    localStorage.setItem('jha', id);
    const modal = await this.modalCtrl.create({
      component: JhaEditComponent,
    });
    return await modal.present();
  }

}
