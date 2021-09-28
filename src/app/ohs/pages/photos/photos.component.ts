import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../@core/services/ohs-resource.service';
import {takeWhile} from 'rxjs/operators';
import {Location} from '@angular/common';
import { ModalController} from '@ionic/angular';
import { PpeCreateComponent } from '../ppe-create/ppe-create.component';
import { PpeEditComponent } from '../ppe-edit/ppe-edit.component';
import { SseCreateComponent } from '../sse-create/sse-create.component';
import { SseEditComponent } from '../sse-edit/sse-edit.component';

@Component({
  selector: 'ngx-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit {
  alive = true;

  public ppe = [];
  public sse = [];
  public SelectedPPETicket: number;
  public SelectedSSETicket: number;
  public ppenames: any;
  public ssenames: any;
  public selectedPPEFile: any;
  public selectedSSEFile: any;
  constructor(public  rsrcService: ResourceService,
              protected _location: Location,
              public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.rsrcService.refresh$.subscribe(
      () => {
        this.getPPEs();
        this.getSSEs();
      },
    );
    this.getPPEs();
    this.getSSEs();
  }

  getPPEs() {
    let ppeInt;
    ppeInt = localStorage.getItem('selectedTicket');
    this.SelectedPPETicket = +ppeInt;
    this.rsrcService.fetchSitePPEByTicket( this.SelectedPPETicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppe = data.results;
        },
      );
  }
  getSSEs() {
    let sseInt;
    sseInt = localStorage.getItem('selectedTicket');
    this.SelectedSSETicket = +sseInt;
    this.rsrcService.fetchSSEFilesByTicket(this.SelectedSSETicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.sse = data.results;
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
  async showPpeCreate() {
    const modal = await this.modalCtrl.create({
      component: PpeCreateComponent,
    });
    return await modal.present();
  }
  async showPpeEdit(id) {
    localStorage.setItem('PPE', id);
    const modal = await this.modalCtrl.create({
      component: PpeEditComponent,
    });
    return await modal.present();
  }
  async showSseCreate() {
    const modal = await this.modalCtrl.create({
      component: SseCreateComponent,
    });
    return await modal.present();
  }
  async showSseEdit(id) {
    localStorage.setItem('SSE', id);
    const modal = await this.modalCtrl.create({
      component: SseEditComponent,
    });
    return await modal.present();
  }

}
