import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Meet } from '../../models/meet';
import { MeetService } from '../../services/meet.service';

@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetListComponent implements OnInit {
  meets$: Observable<Meet[]>;

  constructor(private meetService: MeetService) {
    this.meets$ = this.meetService.readAll();
  }

  ngOnInit(): void {}
}
