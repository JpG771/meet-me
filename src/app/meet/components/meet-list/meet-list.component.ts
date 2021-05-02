import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    if (environment.production) {
      this.meets$ = this.meetService.readAll();
    } else {
      this.meets$ = of([
        {
          title: '',
          offerType: 1,
          type: 'Préposé',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: 'Exemple titre',
          offerType: 1,
          type: 'Préposé',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: 'Exemple titre',
          offerType: 2,
          type: 'Préposé',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: '',
          offerType: 1,
          type: 'Personne à tout faire',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: '',
          offerType: 1,
          type: 'Ménage',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: '',
          offerType: 1,
          type: 'Sport',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: '',
          offerType: 1,
          type: 'Accompagnateur',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
        {
          title: '',
          offerType: 1,
          type: 'Transport',
          user: 'Testeur',
          dateStart: '2021-05-02T12:00',
          dateEnd: '2021-05-02T13:00',
          region: 16,
        },
      ]);
    }
  }

  ngOnInit(): void {}
}
