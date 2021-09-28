import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card (click)="viewDetails(id)">
      <div class="icon-container">
        <div class="icon status-{{ type }}">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title">{{title}}</div>
        <div class="status">{{projects}}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() projects: number;
  @Input() id: number;

  constructor(private router: Router) { }

  viewDetails(id) {
    this.router.navigate([`/operations/projects/${id}`]);
  }

}
