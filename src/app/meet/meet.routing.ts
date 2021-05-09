import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetCalendarComponent } from './components/meet-calendar/meet-calendar.component';
import { MeetListComponent } from './components/meet-list/meet-list.component';
import { MeetUpdateComponent } from './components/meet-update/meet-update.component';

const routes: Routes = [
  {
    path: '',
    component: MeetListComponent,
  },
  {
    path: 'nouveau',
    component: MeetUpdateComponent,
  },
  {
    path: 'calendrier',
    component: MeetCalendarComponent,
  },
  {
    path: ':id',
    component: MeetUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetRoutingModule {}