import { Component, OnInit } from '@angular/core';
import { ToolboxService } from '../../../@core/services/toolbox.service';
import {takeWhile} from 'rxjs/operators';
import {Location} from '@angular/common';
import { TbtCreateModalComponent } from '../tbt-create-modal/tbt-create-modal.component';
import { TbtEditComponent } from '../tbt-edit/tbt-edit.component';

import { ModalController} from '@ionic/angular';



@Component({
  selector: 'ngx-tbt',
  templateUrl: './tbt.component.html',
  styleUrls: ['./tbt.component.scss'],
})
export class TbtComponent implements OnInit {

  alive = true;

  public toolbox = [];
  public SelectedTbtTicket: number;
  constructor(public  tbtService: ToolboxService,
              protected _location: Location,
              public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.tbtService.refresh$.subscribe(
      () => {
        this.getTBTs();
      },
    );
    this.getTBTs();
  }
  getTBTs() {
    let tbtInt;
    tbtInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +tbtInt;
    this.tbtService.fetchToolboxTalksByTicket(this.SelectedTbtTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.toolbox = data.results;
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
      component: TbtCreateModalComponent,
    });
    return await modal.present();
  }
  async showEdit(id) {
    localStorage.setItem('tbt', id);
    const modal = await this.modalCtrl.create({
      component: TbtEditComponent,
    });
    return await modal.present();
  }

}
