import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../@core/modules/shared.module';

// components
import { ChatComponent } from './chat.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NotificationComponent } from './notification/notification.component';


const COMPONENTS = [
  ChatComponent,
  ContactsComponent,
  NotificationComponent,
];

const MODULES = [
  SharedModule,
  ChatRoutingModule,
];

@NgModule({
  imports: [
    ...MODULES,
  ],
  declarations: [
    ...COMPONENTS,
  ],
})
export class ChatModule { }
