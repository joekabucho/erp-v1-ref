import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Rx';
import { tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import { WebSocketService } from './web-socket.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatNotificationService {


  apiUrl = environment.apiURL;
  ws_url = environment.socketURL;


  userToken = localStorage.getItem('currentUserToken');
  loggedInUser: any;

  public messages: Subject<any>;
  public notifications: Subject<any>;


  private refreshNeeded$ = new Subject<void>();


  get refresh$() {
    return this.refreshNeeded$;
  }

  constructor(private _http: HttpClient, private wsSercive: WebSocketService) {
    this.loggedInUser = jwt_decode(this.userToken);
    this.messages = <Subject<any>>this.wsSercive.connect(`${this.ws_url}messages/?token=${this.userToken}`)
      .map((response: MessageEvent) => {
        // console.log(response);
        const data = JSON.parse(response.data);
        return data;
      });
  }


  fecthRealMessages(id) {
    this.messages = <Subject<any>>this.wsSercive.connect(`${this.ws_url}${this.loggedInUser.id}/?token=${this.userToken}`)
      .map((response: MessageEvent) => {
        const data = JSON.parse(response.data);
        return data;
      });
  }

  fetchMessages() {
    return this._http.get<any>(`${this.apiUrl}messages/?limit=100&offset=0`);
  }

  createMessage(formData) {
    return this._http.post(`${this.apiUrl}messages/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }

  createChatMessage(id_1, id_2, formData) {
    return this._http.post(`${this.apiUrl}messages/?author_id=${id_1}&receiver_id=${id_2}`, formData);
  }

  editMessage(id: number, formData) {
    return this._http.patch(`${this.apiUrl}messages/${id}/`, formData);
  }

  deleteMessage(id: number) {
    return this._http.delete<void>(`${this.apiUrl}messages/${id}`);
  }




  fetchNotifications(items: number) {
    return this._http.get<any>(`${this.apiUrl}notifications/?limit=${items}`);
  }

  editNotification(id: number, formData) {
    return this._http.patch(`${this.apiUrl}notifications/${id}/`, formData)
      .pipe(tap(() => {
        this.refreshNeeded$.next();
      }));
  }



}
