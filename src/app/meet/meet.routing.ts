import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetCalendarComponent } from './components/meet-calendar/meet-calendar.component';
import { MeetListComponent } from './components/meet-list/meet-list.component';
import { MeetUpdateComponent } from './components/meet-update/meet-update.component';

const routes: Routes = [
  {
    path: 'list',
    component: MeetListComponent,
  },
  {
    path: 'nouveau',
    component: MeetUpdateComponent,
  },
  {
    path: ':id',
    component: MeetUpdateComponent,
  },
  {
    path: 'calendrier',
    component: MeetCalendarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetRoutingModule {}