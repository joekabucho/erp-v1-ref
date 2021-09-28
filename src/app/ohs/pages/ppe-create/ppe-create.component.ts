import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../@core/services/ohs-resource.service';
import {takeWhile} from 'rxjs/operators';
import { ModalController} from '@ionic/angular';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-ppe-create',
  templateUrl: './ppe-create.component.html',
  styleUrls: ['./ppe-create.component.scss'],
})
export class PpeCreateComponent implements OnInit {

  public ppenames: any;
  public selectedPPEFile: any;
  ppeFile: File = null;
  public ppeForm: FormGroup;
  private alive = true;
  Tickets: any;
  public SelectedTbtTicket: number;



  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              public resourceService: ResourceService,
              private fb: FormBuilder,
  ) {
                  this.ppeForm = this.fb.group({
                    ppe_items: this.fb.array([this.fb.group({
                      file: ['', Validators.required],
                      ppe_names: [null, Validators.required]})]),
                  });
  }

  ngOnInit() {
    this.loadTickets();
    this.getPPENames();
  }

  get ppeItems() {
    return this.ppeForm.get('ppe_items') as FormArray;
  }

  addPpeItems() {
    this.ppeItems.push(this.fb.group({
      file: [''],
      technician: [null, Validators.required],
      safety_officer: [null, Validators.required],
      ticket: [null, Validators.required],
      ppe_names: [null, Validators.required],
    }));
  }


  getPPENames() {
    this.resourceService.fetchPPE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ppenames = data.results;
        },
      );
  }

  loadTickets() {
    let ppeInt;
    ppeInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +ppeInt;
    return this.resourceService.fetchTickets(100).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }
  savePPEFile(ppeitems) {
    const formData = new FormData;

    for (let j = 0; j <= ppeitems.ppe_items.length - 1; j ++) {
      formData.append('ppe_names', ppeitems.ppe_items[j].ppe_names);
      formData.append('safety_officer', this.Tickets[0].safety_officer.id),
        formData.append('ticket', this.Tickets[0].id),
        formData.append('file', this.ppeFile, this.ppeFile.name);
      formData.append('file_type', this.ppeFile.type);
      formData.append('technician', this.Tickets[0].assigned_to.id);

      this.resourceService.createPPEFile(formData)
        .subscribe(
          () => {
            this.showToast('You have successfully added a File', 'success');
          },
          (error: HttpErrorResponse) => {
            this.showToast(error.error.errors.name, 'danger');
          },
        );
    }
  }
  deletePpeItems(index) {
    this.ppeItems.removeAt(index);
  }

  onPPEFileSelected(event) {
    this.ppeFile = event.target.files[0] as File;
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}
