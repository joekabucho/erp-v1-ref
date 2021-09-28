import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NotificationComponent } from './notification/notification.component';


const routes: Routes = [{
  path: '',
  component: ChatComponent,
  children: [
    {
      path: 'messages',
      component: ContactsComponent,
    },
    {
      path: 'messages/:authorId/:receiverId',
      component: ContactsComponent,
    },
    {
      path: 'notifications',
      component: NotificationComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule { }
