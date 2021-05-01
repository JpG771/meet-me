import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-meet-view',
  templateUrl: './meet-view.component.html',
  styleUrls: ['./meet-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
