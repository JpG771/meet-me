import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-meet-calendar',
  templateUrl: './meet-calendar.component.html',
  styleUrls: ['./meet-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetCalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
