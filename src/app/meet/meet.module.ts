import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MeetListComponent } from './components/meet-list/meet-list.component';
import { MeetCalendarComponent } from './components/meet-calendar/meet-calendar.component';
import { MeetViewComponent } from './components/meet-view/meet-view.component';
import { MeetUpdateComponent } from './components/meet-update/meet-update.component';
import { MeetHomeComponent } from './containers/meet-home/meet-home.component';
import { MeetRoutingModule } from './meet.routing';
import { OfferTypePipe } from './pipes/offer-type.pipe';
import { RegionPipe } from './pipes/region.pipe';

@NgModule({
  declarations: [
    MeetListComponent,
    MeetCalendarComponent,
    MeetViewComponent,
    MeetUpdateComponent,
    MeetHomeComponent,
    OfferTypePipe,
    RegionPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MeetRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
  ]
})
export class MeetModule { }
