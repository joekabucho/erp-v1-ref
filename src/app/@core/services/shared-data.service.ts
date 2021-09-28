import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {

  private valueSource = new BehaviorSubject<any>('default');
  private dataSource = new BehaviorSubject<any>('data');
  private searchSource = new BehaviorSubject<any>('search');
  private selectSource = new BehaviorSubject<any>(0);
  private routeSource = new BehaviorSubject<any>('route');

  currentFilter = this.valueSource.asObservable();
  currentData = this.dataSource.asObservable();
  currentSearch = this.searchSource.asObservable();
  currentSelect = this.selectSource.asObservable();
  currentRoute = this.routeSource.asObservable();

  changeValue(message) {
    this.valueSource.next(message);
  }

  changeData(info) {
    this.dataSource.next(info);
  }

  searchData(seachTerm) {
    this.searchSource.next(seachTerm);
  }

  selectDataRecords(num) {
    this.selectSource.next(num);
  }

  changeRoute(path) {
    this.routeSource.next(path);
  }
}
