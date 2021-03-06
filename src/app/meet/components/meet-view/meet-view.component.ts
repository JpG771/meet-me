import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  Optional,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';
import { getMeetTypeClass } from '../../models/meet-type';
import { Message } from '../../../core/models/message';
import { Responder } from '../../models/responder';
import { MeetService } from '../../services/meet.service';
import { MessageService } from '../../../core/services/message.service';
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
  from?: string;

  constructor(
    public userService: UserService,
    public changeRef: ChangeDetectorRef,
    private meetService: MeetService,
    private alertService: AlertService,
    private messageService: MessageService,
    private router: Router,
    @Optional() private bottomSheetRef?: MatBottomSheetRef<MeetViewComponent>
  ) {}

  ngOnInit(): void {}

  getAvatarClass() {
    if (this.meet) {
      return getMeetTypeClass(this.meet.type);
    }
    return {};
  }

  onAnswer() {
    if (this.meet) {
      this.loading = true;
      const responder: Responder = {
        name: this.userService.userName!,
        dateAnswsered: dateToString(new Date()),
      };
      if (!this.meet.responders) {
        this.meet.responders = [];
      }
      this.meet.responders.push(responder);

      this.meetService.update(this.meet).subscribe(
        (response) => {
          console.log('Meet Answered: ', response);
          this.alertService.showSuccess(
            'La réponse a été enregistrée avec succès.'
          );
          this.loading = false;
          this.sendNotification(response, `${this.userService.userName} a accepté votre rencontre "${this.meet?.title ? this.meet.title : this.meet?.id}"`);
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
          this.sendNotification(response, `${this.userService.userName} a annulé votre rencontre "${this.meet?.title ? this.meet.title : this.meet?.id}"`);
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
  onModify() {
    this.router.navigate(['/rencontre', this.meet?.id], {
      queryParams: { from: this.from },
    });
    if (this.bottomSheetRef) {
      this.bottomSheetRef.dismiss();
    }
  }

  private sendNotification(meet: Meet, message: string) {
    const newMessage: Message = {
      toUser: meet.user,
      byUser: this.userService.userName!,
      message: message,
      read: false,
    };
    this.messageService.create(newMessage).subscribe(
      (response) => {
        console.log('Message sent : ', response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
