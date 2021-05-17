import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../services/alert.service';
import { AppDataService } from '../../services/app-data.service';
import { MessageService } from '../../services/message.service';
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

  nbMessage = 0;

  constructor(
    private appDataService: AppDataService,
    private alertService: AlertService,
    private messageService: MessageService,
    private changeRef: ChangeDetectorRef,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.identity = (window as any).netlifyIdentity;

    if (this.identity) {
      this.identity.setLocale('fr');
      this.registerIdentityEvents();
    }
  }
  ngOnDestroy(): void {
    if (this.identity) this.identity.off('login');
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
      this.loadMessages();
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
      this.messageService.read(this.userService.userName).subscribe(messages => {
        console.log('Received messages :', messages);
        this.appDataService.messages.next(messages);
        this.nbMessage = messages.length;
        this.changeRef.markForCheck();
      }, err => { console.log('Could not get messsages', err) })
    }
  }
}
