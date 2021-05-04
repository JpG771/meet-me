import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';

@Component({
  selector: 'app-meet-view',
  templateUrl: './meet-view.component.html',
  styleUrls: ['./meet-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetViewComponent implements OnInit {

  @Input() meet?: Meet;

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    console.log(this.meet);
  }

  getAvatarClass() {
    if (this.meet) {
      return {
        companion: this.meet.type === 'Accompagnateur',
        cleaning: this.meet.type === 'Ménage',
        repair: this.meet.type === 'Personne à tout faire',
        attendant: this.meet.type === 'Préposé',
        sport: this.meet.type === 'Sport',
        transport: this.meet.type === 'Transport'
      };
    }
    return {};
  }

}
