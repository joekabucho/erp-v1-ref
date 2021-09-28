import {Component, OnInit} from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {UserService} from '../../@core/services/user.service';


@Component({
  selector: 'ngx-d3',
  styleUrls: ['./d3.component.scss'],
  templateUrl: './d3.component.html',
})

export class D3Component implements OnInit {
  filtersToTickets: any;
  filtersToPTW: any;
  selectedSO: String = '';
  selectedTechnician: String = '';
  selectedYear: String = '';
  start_date = '' ;
  end_date = '';
  safety_officers = [];
  technicians = [];
  alive = true;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.filtersToTickets = {
      'S': '', // Safety officer
      'T': '', // Technician
      'SY': '', // Year
      'EY': '', // Year

    };
    this.filtersToPTW = {
      'S': '', // Safety officer
      'T': '', // Technician
      'SY': '', // Year
      'EY': '', // Year
    };
    this.getAllUsers();
  }

  getJobChanges() {
    this.filtersToTickets = {
      'S': '', // Safety officer
      'T': '', // Technician
      'SY': '', // Year
      'EY': '', // Year
    };
    this.filtersToTickets.S = this.selectedSO;
    this.filtersToTickets.T = this.selectedTechnician;
    this.filtersToTickets.SY = this.start_date;
    this.filtersToTickets.EY = this.end_date;

  }

  getPTWChanges() {
    this.filtersToPTW = {
      'S': '', // Safety officer
      'T': '', // Technician
      'SY': '', // Year
      'EY': '', // Year
    };
    this.filtersToPTW.S = this.selectedSO;
    this.filtersToPTW.T = this.selectedTechnician;
    this.filtersToPTW.SY = this.start_date;
    this.filtersToPTW.EY = this.end_date;
  }

  getAllUsers() {
    this.userService.fetchUsers()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.safety_officers = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'SAFETY OFFICER';
          }
        });
        this.technicians = data.results.filter((user: any) => {
          if (user.role !== null) {
            return user.role.name === 'TECHNICIAN';
          }
        });
      });
  }

  selectedItem = 2;
}
