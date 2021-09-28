import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToolboxService} from '../../../@core/services/toolbox.service';
import {HttpErrorResponse} from '@angular/common/http';
import {takeWhile} from 'rxjs/operators';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';


@Component({
  selector: 'ngx-attendants',
  templateUrl: './attendants.component.html',
  styleUrls: ['./attendants.component.scss'],
})
export class AttendantsComponent implements OnInit {
  public attendantsForm: FormGroup;
  public attendants: any;
  alive = true;

  constructor(
    public modalCtrl: ModalController,
    private toastr: NbToastrService,
    private fb: FormBuilder,
    public  ToolboxTalksService: ToolboxService,

  ) {
    this.attendantsForm = this.fb.group({
      'firstname': [null, Validators.required],
      'lastname': [null, Validators.required],
      'phone_number': [null, Validators.required],
      'id_number': [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadAttendants();
  }

  loadAttendants() {
    return this.ToolboxTalksService.fetchAttendees().pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.attendants = data.results;
      });
  }
  createAttendants() {
    const modalCloseBtn = document.getElementById('close-attendant');
    const payload = {
      'firstname': this.attendantsForm.get('firstname').value,
      'lastname': this.attendantsForm.get('lastname').value,
      'phone_number': this.attendantsForm.get('phone_number').value,
      'id_number': this.attendantsForm.get('id_number').value,
    };
    this.ToolboxTalksService.createAttendants(payload)
      .subscribe(
        () => {
          modalCloseBtn.click();
          this.showToast('You have successfully created an attendant', 'success');
          this.loadAttendants();
        },
        (error: HttpErrorResponse) => {
          this.showToast('Unable to created attendant', 'danger');
        },
      );
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }
}
