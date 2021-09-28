import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
interface SLATargetEntry {
  priority: { name: string, color: string };
  firstResponse: string;
  everyResponse: string;
  resolutionTime: string;
  operationalHours: any[];
  escalation: boolean;
}

@Component({
  selector: 'ngx-create-sla',
  templateUrl: './create-sla.component.html',
  styleUrls: ['./create-sla.component.scss'],
})
export class CreateSLAComponent implements OnInit {
// TODO: Make this dynamic
  entries: SLATargetEntry[] = [];
  dhm: any;

  everyResponseTimeDay: any = 0;
  everyResponseTimeHrs: any = 0;
  everyResponseTimeMin: any = 0;

  firstResponseTimeDay: any;
  firstResponseTimeHrs: any;
  firstResponseTimeMin: any;

  resolutionTimeDay: any;
  resolutionTimeHrs: any;
  resolutionTimeMin: any;


  agentReminderForm: FormGroup;
  escalationForm: FormGroup;




  constructor(private fb: FormBuilder) {

    this.agentReminderForm = this.fb.group({
      reminders: this.fb.array([]) ,
    });

    this.escalationForm = this.fb.group({
      escalations: this.fb.array([]) ,
    });
  }

  // Escalation Forms logic
  escalations(): FormArray {
    return this.escalationForm.get('escalations') as FormArray;
  }

  newEscalation(): FormGroup {
    return this.fb.group({
      escalationCondition: '',
      escalationUrgency: '',
      escalateTo: '',
    });
  }

  addEscalation() {
    this.escalations().push(this.newEscalation());
  }

  removeEscalation(i: number) {
    this.escalations().removeAt(i);
  }

  onSubmitEscalation() {
    // console.log(this.escalationForm.value);
  }

  // Reminders Forms logic
  reminders(): FormArray {
    return this.agentReminderForm.get('reminders') as FormArray;
  }
  newReminder(): FormGroup {
    return this.fb.group({
      when: '',
      approachesIn: '',
      reminderTo: '',
    });
  }
  addReminder() {
    this.reminders().push(this.newReminder());
  }
  removeReminder(i: number) {
    this.reminders().removeAt(i);
  }

  onSubmitReminder() {
    // console.log(this.agentReminderForm.value);
  }

  ngOnInit() {

    this.entries = [
      {
        priority: {name: 'urgent', color: '#FF5959'},
        firstResponse: '15m',
        everyResponse: 'Enter response time',
        resolutionTime: '15m',
        operationalHours: ['Business hours', 'Calendar hours'],
        escalation: true,
      },
      {
        priority: {name: 'high', color: '#FFD012'},
        firstResponse: '15m',
        everyResponse: 'Enter response time',
        resolutionTime: '15m',
        operationalHours: ['Business hours', 'Calendar hours'],
        escalation: true,
      },
      {
        priority: {name: 'medium', color: '#4DA1FF'},
        firstResponse: '15m',
        everyResponse: 'Enter response time',
        resolutionTime: '15m',
        operationalHours: ['Business hours', 'Calendar hours'],
        escalation: true,
      },
      {
        priority: {name: 'low', color: '#A0D76A'},
        firstResponse: '15m',
        everyResponse: 'Enter response time',
        resolutionTime: '15m',
        operationalHours: ['Business hours', 'Calendar hours'],
        escalation: true,
      },
    ];
  }

  // setEveryResponseTime(event: any) {
  //   console.log(event.target.value);
  // }
  setEveryResponseTime(event: any) {
    // console.log(this.everyResponseTimeDay + 'd', this.everyResponseTimeHrs + 'h', this.everyResponseTimeMin + 'm');
  }

  // ngOnChanges(changes: SimpleChanges) {
  //
  //   this.doSomething(changes.categoryId.currentValue);
  //   // You can also use categoryId.previousValue and
  //   // categoryId.firstChange for comparing old and new values
  //
  // }


}
