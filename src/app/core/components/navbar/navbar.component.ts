import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getDefaultUserDetail } from '../../models/user-detail';
import { AlertService } from '../../services/alert.service';
import { AppDataService } from '../../services/app-data.service';
import { MessageService } from '../../services/message.service';
import { UserDetailService } from '../../services/user-detail.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  private identity: any;
  isProduction = environment.production;

  nbMessageNotRead = 0;

  private subscription: Subscription;

  constructor(
    private appDataService: AppDataService,
    private alertService: AlertService,
    private messageService: MessageService,
    private changeRef: ChangeDetectorRef,
    public userService: UserService,
    private userDetailService: UserDetailService,
    private ngZone: NgZone
  ) {
    this.subscription = this.appDataService.messageUpdate.subscribe(messages => {
      this.nbMessageNotRead = messages.filter(messages => !messages.read).length;
      this.changeRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.identity = (window as any).netlifyIdentity;

    if (this.identity) {
      this.identity.setLocale('fr');
      this.registerIdentityEvents();
    }
  }
  ngOnDestroy(): void {
    if (this.identity) this.identity.off('login');
    this.subscription.unsubscribe();
  }

  onUserClick() {
    if (this.identity) {
      this.identity.open();
    } else {
      this.alertService.showError(
        `Le composant de conexion ne s'est pas initialiser correctement.`
      );
    }
  }

  private registerIdentityEvents() {
    this.identity.on('init', (user: any) => console.log('init', user));
    this.identity.on('login', (user: any) => {
      console.log('login', user);
      this.userService.currentUser = user;
      this.ngZone.run(() => {
        this.loadMessages();
        this.loadUserDetail();
      });
    });
    this.identity.on('logout', () => {
      console.log('Logged out');
      this.userService.currentUser = undefined;
    });
    this.identity.on('error', (err: any) => console.error('Error', err));
    this.identity.on('open', () => console.log('Widget opened'));
    this.identity.on('close', () => console.log('Widget closed'));
  }

  private loadMessages() {
    if (this.userService.userName) {
      this.messageService.read(this.userService.userName).subscribe(
        (messages) => {
          console.log('Received messages :', messages);
          this.appDataService.messages.next(messages);
          this.nbMessageNotRead = messages.filter(messages => !messages.read).length;
          this.changeRef.markForCheck();
        },
        (error: HttpErrorResponse) => {
          console.log('Could not get messsages', error);
        }
      );
    }
  }

  private loadUserDetail() {
    if (this.userService.userName) {
      this.userDetailService.getForUser(this.userService.userName).subscribe(
        (userDetail) => {
          if (userDetail) {
            this.appDataService.userDetail.next(userDetail);
          }
        },
        (error: HttpErrorResponse) => {
          console.log('userDetailService.getForuser error : ', error);
          if (error.status === 400) {
            if (this.userService.userName) {
              const newUserDetail = getDefaultUserDetail(
                this.userService.userName
              );
              this.appDataService.userDetail.next(newUserDetail);
            }
          }
        }
      );
    }
  }
}
