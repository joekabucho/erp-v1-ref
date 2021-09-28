import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.scss'],
})
export class SlaComponent implements OnInit {
  checked = true;

  constructor() {
  }

  ngOnInit(): void {
    this.checked = true;
  }
}
