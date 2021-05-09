import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';
import { getMeetTypeClass } from '../../models/meet-type';

@Component({
  selector: 'app-meet-calendar',
  templateUrl: './meet-calendar.component.html',
  styleUrls: ['./meet-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetCalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'fr-ca',
    dragScroll: false,
    dateClick: this.onDateClick.bind(this),
    eventDragStart: this.onDragStart.bind(this),
    eventDragStop: this.onDragStop.bind(this),
  };  

  meets?: Meet[];
  sidenavOpened = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  onMeetsChange(meets: Meet[]) {
    this.meets = meets;
    meets.forEach(meet => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().addEvent({
          title: meet.title ? meet.title : meet.type,
          start: meet.dateStart,
          end: meet.dateEnd,
          className: getMeetTypeClass(meet.type),
          editable: meet.user === this.userService.userName,
          extendedProps: meet
        })
      }
    });
  }
  onFilterClick() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  onDateClick(arg: any) {
    console.log('date click! ' + arg.dateStr);
  }
  onDragStart(arg: any) {
    console.log('onDragStart : ' + arg);
  }
  onDragStop(arg: any) {
    console.log('onDragStop : ' + arg);
  }
  onStartEdit(arg: any) {
    console.log('onStartEdit : ' + arg);
  }

  toggleWeekends() {
    if (this.calendarComponent) {
      if (this.calendarComponent.getApi().view.type === 'dayGridMonth') {
        this.calendarComponent.getApi().changeView('timeGridWeek');
      } else {
        this.calendarComponent.getApi().changeView('dayGridMonth');
      }
    }
  }
}
