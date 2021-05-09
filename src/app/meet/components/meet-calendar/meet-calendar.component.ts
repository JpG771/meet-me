import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';
import {
  getMeetTypeClass,
  getMeetTypeColorLight,
} from '../../models/meet-type';
import { MeetViewComponent } from '../meet-view/meet-view.component';
import { MeetService } from '../../services/meet.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-meet-calendar',
  templateUrl: './meet-calendar.component.html',
  styleUrls: ['./meet-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'fr-ca',
    dragScroll: false,
    dateClick: this.onDateClick.bind(this),
    eventDrop: this.onDrop.bind(this),
    select: this.onSelect.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventResize: this.onEventResize.bind(this),
    eventTextColor: 'black',
  };

  meets?: Meet[];
  sidenavOpened = false;

  private subscriptions;

  constructor(
    private userService: UserService,
    private meetService: MeetService,
    private alertService: AlertService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptions = this.route.queryParams.subscribe(params => {
      /* if (params.view) {
        // Selectable is not working with this code
        setTimeout(() => this.toggleWeekends(), 500);
      } */
    });
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onMeetsChange(meets: Meet[]) {
    this.meets = meets;
    meets.forEach((meet) => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().addEvent({
          title: meet.title ? meet.title : meet.type,
          start: meet.dateStart,
          end: meet.dateEnd,
          className: getMeetTypeClass(meet.type),
          editable: meet.user === this.userService.userName,
          extendedProps: meet,
          color: getMeetTypeColorLight(meet.type),
        });
      }
    });
  }
  onFilterClick() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  onDateClick(arg: any) {
    console.log('date click! ' + arg.dateStr);

    if (this.isCalendarView()) {
      this.router.navigate(['rencontre', 'nouveau'], {
        queryParams: {
          date: arg.dateStr,
          from: '/rencontre/calendrier',
        },
      });
    }
  }
  onDrop(arg: any) {
    console.log('onDrop : ', arg);
    
    if (arg.delta.days !== 0 || arg.delta.milliseconds !== 0 || arg.delta.months !== 0 || arg.delta.years !== 0) {
      this.modifyEvent(arg);
    }
  }
  onSelect(arg: any) {
    console.log('onSelect : ', arg);

    const dateStart = arg.startStr.substring(0, 16);
    const dateEnd = arg.endStr.substring(0, 16);

    this.router.navigate(['rencontre', 'nouveau'], {
      queryParams: {
        dateStart: dateStart,
        dateEnd: dateEnd,
        from: '/rencontre/calendrier',
        view: 'timeGridWeek'
      },
    });
  }
  onEventClick(arg: any) {
    console.log('onEventClick : ', arg);

    if (arg.event.extendedProps) {
      const bottomSheetRef = this.bottomSheet.open(MeetViewComponent);
      bottomSheetRef.instance.meet = arg.event.extendedProps;
      bottomSheetRef.instance.from = '/rencontre/calendrier';
      bottomSheetRef.instance.changeRef.markForCheck();
    }
  }
  onEventResize(arg: any) {
    console.log('onEventResize : ', arg);
    
    if (arg.endDelta.days !== 0 || arg.endDelta.milliseconds !== 0 || arg.endDelta.months !== 0 || arg.endDelta.years !== 0) {
      this.modifyEvent(arg);
    }
  }

  private modifyEvent(arg: any) {
    const meet: Meet = { ...arg.event.extendedProps };
    meet.dateStart = arg.event.startStr.substring(0, 16);
    meet.dateEnd = arg.event.endStr.substring(0, 16);

    this.meetService.update(meet).subscribe((response) => {
      console.log('Saved Meet : ', response);
      this.alertService.showSuccess(
        'La rencontre a été enregistré avec succès.'
      );
    },
      (error) => {
        console.error(error);
        this.alertService.showError(
          `Un problème s'est produit lors de l'enregistrement.`
        );
      });
  }

  toggleWeekends() {
    if (this.calendarComponent) {
      if (this.calendarComponent.getApi().view.type === 'dayGridMonth') {
        this.calendarComponent.getApi().changeView('timeGridWeek');
        this.calendarOptions = {
          ...this.calendarOptions,
          selectable: true,
        };
      } else {
        this.calendarComponent.getApi().changeView('dayGridMonth');
        this.calendarOptions = {
          ...this.calendarOptions,
          selectable: false,
        };
      }
    }
  }

  private isCalendarView() {
    if (this.calendarComponent) {
      if (this.calendarComponent.getApi().view.type === 'timeGridWeek')
        return false;
    }
    return true;
  }
}
