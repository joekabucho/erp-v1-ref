import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { HazardService } from '../../../@core/services/hazard.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../@core/services/user.service';
import { AttendantsComponent } from '../attendants/attendants.component';


@Component({
  selector: 'ngx-jha-create-modal',
  templateUrl: './jha-create-modal.component.html',
  styleUrls: ['./jha-create-modal.component.scss'],
})
export class JhaCreateModalComponent implements OnInit {
  Tickets: any;

  hazards = [];

  public hazForm: FormGroup;
  alive = true;
  public SelectedTbtTicket: number;
  public Supervisor = [];
  public attendants: any;
  keywordSup = 'first_name';
  public selectedSup: any;





  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              private fb: FormBuilder,
              public hazardService: HazardService,
              private userService: UserService,

  ) {
    this.hazForm = this.fb.group({
      'job_hazards': [null, Validators.required],
      'fire_fighter': [null, Validators.required],
      'first_aider': [null, Validators.required],
      'team_members': [null, Validators.required],
      'supervisor': [null, Validators.required],
      'date': [null, Validators.required],
      'description': [null, Validators.required],
      'done_by': [null, Validators.required],

    });
  }

  ngOnInit() {
    this.loadTickets();
    this.getAllUsers();
    this.getHazards();
    this.loadAttendants();
  }
  selectSup(item) {
    // do something with selected item
    this.selectedSup = item.id;
  }
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onFocusedSup(e) {
    // do something when input is focused
    this.getAllUsers();
  }

  loadTickets() {
    let hazInt;
    hazInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +hazInt;
    return this.hazardService.fetchTickets().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }
  saveHazard() {
    const payload = {
      'job_hazards': this.hazForm.get('job_hazards').value,
      'ticket': this.Tickets[0].id,
      'fire_fighter': this.hazForm.get('fire_fighter').value,
      'first_aider': this.hazForm.get('first_aider').value,
      'team_members': this.hazForm.get('team_members').value,
      'supervisor': this.selectedSup,
      'description': this.hazForm.get('description').value,
      'date': this.hazForm.get('date').value,
      'done_by': this.hazForm.get('done_by').value,

    };
    this.hazardService.createHazardAnalysis(payload)
      .subscribe(
        () => {
          this.showToast('You have successfully added the Analysis', 'success');
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to add Analysis', 'danger');
        },
      );
  }
  loadAttendants() {
    return this.hazardService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Supervisor = data.results.filter(user => {
          if (user.role !== null) {
            return user.role.name === 'SUPERVISOR';
          }
        });
      });
  }
  getHazards() {
    this.hazardService.fetchHazards(100)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.hazards = data.results;
          });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

  async showAttendants() {
    const modal = await this.modalCtrl.create({
      component: AttendantsComponent,
    });
    return await modal.present();
  }

}
