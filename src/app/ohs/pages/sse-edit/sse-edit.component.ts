import { Component, OnInit } from '@angular/core';
import { ResourceService } from '../../../@core/services/ohs-resource.service';
import {takeWhile} from 'rxjs/operators';
import { ModalController} from '@ionic/angular';
import {NbComponentStatus, NbToastrService} from '@nebular/theme';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'ngx-sse-edit',
  templateUrl: './sse-edit.component.html',
  styleUrls: ['./sse-edit.component.scss'],
})
export class SseEditComponent implements OnInit {

  public ssenames: any;
  public selectedPPEFile: any;
  sseFile: File = null;
  public sseForm: FormGroup;
  private alive = true;
  public Site: any;
  Tickets: any;
  public SelectedTbtTicket: number;
  public sseId: any;
  constructor(public modalCtrl: ModalController,
              private toastr: NbToastrService,
              public resourceService: ResourceService,
              private fb: FormBuilder,
  ) {
    this.sseForm = this.fb.group({
      sse_items: this.fb.array([this.fb.group({
        file: ['', Validators.required],
        safety_officer: [null, Validators.required],
        site: [null, Validators.required],
        ticket: [null, Validators.required],
        sse_names: [null, Validators.required]})]),
    });
  }

  ngOnInit() {
    this.loadTickets();
    this.loadSites();
    this.getSSENames();
  }

  get sseItems() {
    return this.sseForm.get('sse_items') as FormArray;
  }

  deleteSseItems(index) {
    this.sseItems.removeAt(index);
  }
  addSseItems() {
    this.sseItems.push(this.fb.group({
      file: [''],
      technician: [null, Validators.required],
      safety_officer: [null, Validators.required],
      ticket: [null, Validators.required],
      sse_names: [null, Validators.required],
    }));
  }

  loadSites() {
    this.resourceService.fetchSites()
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.Site = data.results;
        },
      );
  }
  getSSENames() {
    this.resourceService.fetchSiteSSE(1000)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        data => {
          this.ssenames = data.results;
        },
      );
  }

  loadTickets() {
    let sseInt;
    sseInt = localStorage.getItem('selectedTicket');
    this.SelectedTbtTicket = +sseInt;
    return this.resourceService.fetchTickets(100).pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.Tickets = data.results.filter(tickets => {
          return tickets.id === this.SelectedTbtTicket;
        });
      });
  }
  editSSEFile(sseitems) {
    const formData = new FormData;
    this.sseId = localStorage.getItem('SSE');
    for (let j = 0; j <= sseitems.sse_items.length - 1; j ++) {
      formData.append('sse_names', sseitems.sse_items[j].sse_names);
      formData.append('site', sseitems.sse_items[j].site);
      formData.append('ticket', this.Tickets[0].id);
      formData.append('safety_officer', this.Tickets[0].safety_officer.id);
      formData.append('file', this.sseFile, this.sseFile.name);
      formData.append('file_type', this.sseFile.type);
      this.resourceService.editSSEFiles(this.sseId, formData)
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
  onSSEFileSelected(event) {
    this.sseFile = event.target.files[0] as File;
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

  showToast(message, status: NbComponentStatus) {
    this.toastr.show(message, `Hi there!`, { status });
  }

}
