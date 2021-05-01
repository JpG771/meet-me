import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetListComponent } from './components/meet-list/meet-list.component';
import { MeetCalendarComponent } from './components/meet-calendar/meet-calendar.component';
import { MeetViewComponent } from './components/meet-view/meet-view.component';
import { MeetUpdateComponent } from './components/meet-update/meet-update.component';
import { MeetHomeComponent } from './containers/meet-home/meet-home.component';
import { MeetRoutingModule } from './meet.routing';

@NgModule({
  declarations: [
    MeetListComponent,
    MeetCalendarComponent,
    MeetViewComponent,
    MeetUpdateComponent,
    MeetHomeComponent
  ],
  imports: [
    CommonModule,
    MeetRoutingModule
  ]
})
export class MeetModule { }
