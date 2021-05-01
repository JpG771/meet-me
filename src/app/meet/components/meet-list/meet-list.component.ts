import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
