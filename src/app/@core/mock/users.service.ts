import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Contacts, RecentUsers, UserData } from '../data/users';

@Injectable()
export class UserService extends UserData {

  private time: Date = new Date;

  private users = {
    haron: { name: 'Haron Maina', picture: 'assets/images/haron.jpeg' },
    gidi: { name: 'Gideon Chepkwony', picture: 'assets/images/gidi.jpeg' },
    ess: { name: 'Esther Muchai', picture: 'assets/images/ess.jpeg' },
    greg: { name: 'Gregory Isaac', picture: 'assets/images/greg.jpeg' },
    ray: { name: 'Rachael Shitanda', picture: 'assets/images/ray.jpeg' },
    imma: { name: 'Immanuel Moringa', picture: 'assets/images/imma.jpeg' },
    elvo: { name: 'Elvis Amuni', picture: 'assets/images/elvo.jpg' },
    hosea: { name: 'Hosea Odoi', picture: 'assets/images/hosea.jpeg' },
    roba: { name: 'Robert Odhams', picture: 'assets/images/roba.jpeg' },
  };
  private types = {
    fiber: 'fiber',
    bts: 'bts',
    ms: 'ms',
  };
  private contacts: Contacts[] = [
    { user: this.users.roba, type: this.types.bts },
    { user: this.users.haron, type: this.types.fiber },
    { user: this.users.imma, type: this.types.ms },
    { user: this.users.ess, type: this.types.bts },
    { user: this.users.gidi, type: this.types.bts },
    { user: this.users.ray, type: this.types.fiber },
    { user: this.users.greg, type: this.types.bts },
    { user: this.users.elvo, type: this.types.ms },
    { user: this.users.hosea, type: this.types.fiber },
  ];
  private recentUsers: RecentUsers[] = [
    { user: this.users.greg, type: this.types.bts, time: this.time.setHours(5, 29) },
    { user: this.users.roba, type: this.types.bts, time: this.time.setHours(9, 0) },
    { user: this.users.hosea, type: this.types.fiber, time: this.time.setHours(9, 31) },
    { user: this.users.gidi, type: this.types.bts, time: this.time.setHours(10, 42) },
    { user: this.users.imma, type: this.types.ms, time: this.time.setHours(10, 45) },
    { user: this.users.ess, type: this.types.bts, time: this.time.setHours(11, 24) },
    { user: this.users.elvo, type: this.types.ms, time: this.time.setHours(12, 0) },
    { user: this.users.ray, type: this.types.fiber, time: this.time.setHours(17, 45) },
    { user: this.users.haron, type: this.types.fiber, time: this.time.setHours(21, 12) },
  ];

  getUsers(): Observable<any> {
    return observableOf(this.users);
  }

  getContacts(): Observable<Contacts[]> {
    return observableOf(this.contacts);
  }

  getRecentUsers(): Observable<RecentUsers[]> {
    return observableOf(this.recentUsers);
  }
}
