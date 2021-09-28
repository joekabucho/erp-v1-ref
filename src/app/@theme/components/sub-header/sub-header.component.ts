import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ShareDataService } from '../../../@core/services/shared-data.service';

@Component({
  selector: 'ngx-sub-header',
  styleUrls: ['./sub-header.component.scss'],
  templateUrl: './sub-header.component.html',
})
export class SubheaderComponent {

  path: any;
  search: any;
  itemsPerPage = 25;


  constructor(
    private router: Router,
    private shared: ShareDataService,
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.path = val.url;
        this.shared.changeRoute(this.path);
        this.shared.changeData('data');
        this.shared.searchData('search');
        this.shared.selectDataRecords(0);
        this.itemsPerPage = 25;
      }
    });
  }



  nextPage() {
    this.shared.changeData('next');
  }

  previousPage() {
    this.shared.changeData('previous');
  }

  searchDetails() {
    this.shared.searchData(this.search);
  }

  onChange(evt) {
    this.itemsPerPage = evt;
    this.shared.selectDataRecords(evt);
  }

}
