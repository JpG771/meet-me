import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';
import { Responder } from '../../models/responder';
import { MeetService } from '../../services/meet.service';
import { dateToString } from '../../utils/date.utils';

@Component({
  selector: 'app-meet-view',
  templateUrl: './meet-view.component.html',
  styleUrls: ['./meet-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetViewComponent implements OnInit {
  @Input() meet?: Meet;

  loading = false;

  constructor(
    public userService: UserService,
    private meetService: MeetService,
    private alertService: AlertService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  getAvatarClass() {
    if (this.meet) {
      return {
        companion: this.meet.type === 'Accompagnateur',
        cleaning: this.meet.type === 'Ménage',
        repair: this.meet.type === 'Personne à tout faire',
        attendant: this.meet.type === 'Préposé',
        sport: this.meet.type === 'Sport',
        transport: this.meet.type === 'Transport',
      };
    }
    return {};
  }

  onAnswer() {
    if (this.meet) {
      this.loading = true;
      const responder: Responder = {
        name: this.userService.userName,
        dateAnswsered: dateToString(new Date()),
      };
      if (!this.meet.responders) {
        this.meet.responders = [];
      }
      this.meet.responders.push(responder);

      this.meetService
        .update(this.meet)
        .subscribe(
          (response) => {
            console.log('Meet Answered: ', response);
            this.alertService.showSuccess(
              'La réponse a été enregistrée avec succès.'
            );
            this.loading = false;
            this.changeRef.markForCheck();
          },
          (error) => {
            console.error(error);
            this.alertService.showError(
              `Un problème s'est produit lors de la communication avec le serveur.`
            );
            if (this.meet) {
              this.meet.responders = [];
            }
            this.loading = false;
            this.changeRef.markForCheck();
          }
        );
    }
  }
  onCancel() {
    if (this.meet) {
      this.loading = true;
      const tempResponders = this.meet.responders;
      this.meet.responders = [];

      this.meetService.update(this.meet).subscribe(
        (response) => {
          console.log('Meet Answer deleted: ', response);
          this.alertService.showSuccess(`Annulé avec succès.`);
          this.loading = false;
          this.changeRef.markForCheck();
        },
        (error) => {
          console.error(error);
          this.alertService.showError(
            `Un problème s'est produit lors de la communication avec le serveur.`
          );
          if (this.meet) {
            this.meet.responders = tempResponders;
          }
          this.loading = false;
          this.changeRef.markForCheck();
        }
      );
    }
  }
}
