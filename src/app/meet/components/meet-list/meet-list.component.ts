import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Meet } from '../../models/meet';

@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetListComponent {
  meets?: Meet[];
  sidenavOpened = true;

  constructor(private changeRef: ChangeDetectorRef) {}

  onMeetsChange(meets: Meet[]) {
    this.meets = meets;
    this.changeRef.markForCheck();
  }
  onFilterClick() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
