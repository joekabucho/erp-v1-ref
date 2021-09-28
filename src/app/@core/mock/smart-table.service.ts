import { Injectable } from '@angular/core';
import { SmartTableData } from '../data/smart-table';

@Injectable()
export class SmartTableService extends SmartTableData {

  data = [
    {
      // img: 'assets/images/nick.png',
      employeeNo: 1,
      username: 'nick',
      email: 'nick@gmail.com',
      department: 'BTS',
      role: 'Supervisior',
      lastSeen: '10pm',
      active: true,
    },
    {
      // img: 'assets/images/kate.png',
      employeeNo: 2,
      username: 'kate',
      email: 'kate@gmail.com',
      department: 'Fiber',
      role: 'Project Manager',
      lastSeen: '1pm',
      active: true,
    },
    {
      // img: 'assets/images/sirElvizy.jpg',
      employeeNo: 3,
      username: 'elvo',
      email: 'elvo@gmail.com',
      department: 'BTS',
      role: 'Supervisior',
      lastSeen: '1pm',
      active: true,
    },
    {
      // img: 'assets/images/sirElvizy.jpg',
      employeeNo: 4,
      username: 'hosea',
      email: 'hosea.kip@gmail.com',
      department: 'BTS',
      role: 'Technician',
      lastSeen: '1pm',
      active: true,
    },
    {
      // img: 'assets/images/sirElvizy.jpg',
      employeeNo: 5,
      username: 'Max',
      email: 'max@gmail.com',
      department: 'BTS',
      role: 'Field Engineer',
      lastSeen: '1pm',
      active: true,
    },
  ];

  getData() {
    return this.data;
  }
  getId(id: number) {
    this.data.filter(obj => {
      obj.employeeNo = id;
      return obj;
    });
  }
}
