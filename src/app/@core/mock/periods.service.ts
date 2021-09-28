import { Injectable } from '@angular/core';

@Injectable()
export class PeriodsService {

  months = [
    { id: 1, month: 'Jan', value: 0 },
    { id: 2, month: 'Feb', value: 0 },
    { id: 3, month: 'Mar', value: 0 },
    { id: 4, month: 'Apr', value: 0 },
    { id: 5, month: 'May', value: 0 },
    { id: 6, month: 'Jun', value: 0 },
    { id: 7, month: 'Jul', value: 0 },
    { id: 8, month: 'Aug', value: 0 },
    { id: 9, month: 'Sep', value: 0 },
    { id: 10, month: 'Oct', value: 0 },
    { id: 11, month: 'Nov', value: 0 },
    { id: 12, month: 'Dec', value: 0 },
  ];

  getYears() {
    return [
      '2020',
    ];
  }

  getMonths() {
    return this.months.map(i => {
      return i.month;
    });
  }

  getMonth() {
    return [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
  }

  getMonthsData() {
    return this.months;
  }

  getWeeks() {
    return [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
    ];
  }
}
