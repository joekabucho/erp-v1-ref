import { Component, OnInit } from '@angular/core';
import { WorkpermitService } from '../../../@core/services/workpermit.service';
import {takeWhile} from 'rxjs/operators';
import {Location} from '@angular/common';
import { PermitCreateModalComponent } from '../permit-create-modal/permit-create-modal.component';
import { PermitApprovalComponent } from '../permit-approval/permit-approval.component';
import { ModalController} from '@ionic/angular';

@Component({
  selector: 'ngx-permits',
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.scss'],
})
export class PermitsComponent implements OnInit {

  alive = true;

  public permits = [];
  public SelectedPermitTicket: number;
  constructor(public  permitService: WorkpermitService,
              protected _location: Location,
              public modalCtrl: ModalController,

  ) { }

  ngOnInit() {
    this.permitService.refresh$.subscribe(
      () => {
        this.getPermits();
      },
    );
    this.getPermits();
  }
  getPermits() {
    let permInt;
    permInt = localStorage.getItem('selectedTicket');
    this.SelectedPermitTicket = +permInt;
    this.permitService.fetchWorkpermitsByTicket(this.SelectedPermitTicket)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.permits = data.results;
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
  async showModal(id) {
    localStorage.setItem('selectedPTW', id);
    const modal = await this.modalCtrl.create({
      component: PermitCreateModalComponent,
    });
    return await modal.present();
  }
  async showApproval(id) {
    localStorage.setItem('selectedPTW', id);
    const modal = await this.modalCtrl.create({
      component: PermitApprovalComponent,
    });
    return await modal.present();
  }
}

