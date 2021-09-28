import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { CommunicationPlanService } from '../../../@core/services/communication-plan.service';
import {Location} from '@angular/common';
import { CommunicationplanEditComponent } from '../communicationplan-edit/communicationplan-edit.component';
import { CommunicationplanCreateComponent } from '../communicationplan-create/communicationplan-create.component';
import { ModalController} from '@ionic/angular';
import {ToolboxService} from '../../../@core/services/toolbox.service';


@Component({
  selector: 'ngx-communicationplan',
  templateUrl: './communicationplan.component.html',
  styleUrls: ['./communicationplan.component.scss'],
})
export class CommunicationplanComponent implements OnInit {

  alive = true;

  public commPlans = [];
  public SelectedCommPlan: number;
  Tickets: any;


  constructor(    public  commService: CommunicationPlanService,
                  protected _location: Location,
                  public modalCtrl: ModalController,
                  public toolboxService: ToolboxService,



  ) {}

  ngOnInit() {
    this.commService.refresh$.subscribe(
      () => {
        this.getCommPlan(null);
      },
    );
    this.loadTickets();
    this.getCommPlan(null);
  }
  loadTickets() {
    let commInt;
    commInt = localStorage.getItem('selectedTicket');
    this.SelectedCommPlan = +commInt;
    return this.toolboxService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedCommPlan;
        });
      });
  }
  getCommPlan(event) {
    this.commService.fetchCommunication(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        comm => {
          this.commPlans = comm.results.filter(plan => {
            return plan.site.id === this.Tickets[0].site.id;
          });
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
      component: CommunicationplanCreateComponent,
    });
    return await modal.present();
  }
  async showEdit(id) {
    const modal = await this.modalCtrl.create({
      component: CommunicationplanEditComponent,
    });
    localStorage.setItem('commPlan', id);
    return await modal.present();
  }

}
