import {Component, TemplateRef, OnInit} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';


@Component({
  selector: 'ngx-positive-safety-observation',
  templateUrl: './positive-safety-observation.component.html',
  styleUrls: ['./positive-safety-observation.component.scss'],
})
export class PositiveSafetyObservationComponent implements OnInit {


  pboForm: FormGroup;
  pboEditForm: FormGroup;

  headElements = [
    '', 'ID', 'REFERENCE', 'DATE', 'TIME',  'SITE', 'CONTRACTOR', 'SITE ENGINEER', 'DESC OF WORK', 'PPE', 'RISK TREATMENT', 'COMPLIANCE TO SAFARICOM ABSOLUTE RULES', 'PROVISION OF WORK EQUIPMENT', 'EMERGENCY RESPONSE', 'EDIT', 'DELETE',
  ];
  constructor(
    private dialogService: NbDialogService,
    private fb: FormBuilder,

  ) {
    this.pboForm = this.fb.group({
      // 'observer': [null, Validators.required],
    });

    this.pboEditForm = this.fb.group({
      // 'date': [null, Validators.required],
    });
  }

  ngOnInit() {
  }


  create(dialog: TemplateRef<any>) {
      this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }
  edit(dialog1: TemplateRef<any>) {
    this.dialogService.open(dialog1, { context: 'this is some additional data passed to dialog' });
  }

}
