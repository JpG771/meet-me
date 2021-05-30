import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../../models/message';
import { AppDataService } from '../../services/app-data.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit, OnDestroy {
  messages?: Message[];

  private subscription?: Subscription;

  constructor(
    private appDataService: AppDataService,
    private messageService: MessageService,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.appDataService.messages.subscribe((messages) => {
      this.messages = messages;
      this.changeRef.detectChanges();
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  markAsRead(message: Message, read: boolean) {
    message.read = read;
    this.messageService.update(message).subscribe(
      (response) => {
        console.log('Message sent : ', response);
        this.appDataService.messageUpdate.next(this.messages);
        this.changeRef.markForCheck();
      },
      (error) => {
        message.read = !read;
        console.error(error);
      }
    );
  }
}
