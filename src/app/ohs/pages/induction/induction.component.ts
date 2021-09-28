import { Component, OnInit } from '@angular/core';
import { InductionService } from '../../../@core/services/induction.service';
import {takeWhile} from 'rxjs/operators';
import {Location} from '@angular/common';
import { InductionCreateModalComponent } from '../induction-create-modal/induction-create-modal.component';
import { InductionEditComponent } from '../induction-edit/induction-edit.component';
import { ModalController} from '@ionic/angular';


@Component({
  selector: 'ngx-induction',
  templateUrl: './induction.component.html',
  styleUrls: ['./induction.component.scss'],
})
export class InductionComponent implements OnInit {

  alive = true;

  public induction = [];
  public SelectedInductionTicket: number;
  constructor( public  inductionService: InductionService,
               protected _location: Location,
               public modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.inductionService.refresh$.subscribe(
      () => {
        this.getInductions();
      },
    );
    this.getInductions();
  }

  getInductions() {
    let inductiontInt;
    inductiontInt = localStorage.getItem('selectedTicket');
    this.SelectedInductionTicket = +inductiontInt;
    this.inductionService.fetchSafetyInductionsByTicket(this.SelectedInductionTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.induction = data.results;
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
      component: InductionCreateModalComponent,
    });
    return await modal.present();
  }
  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: InductionEditComponent,
    });
    localStorage.setItem('induction', id);
    return await modal.present();
  }


}
