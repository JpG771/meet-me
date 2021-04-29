import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  private identity: any;

  constructor(private _snackBar: MatSnackBar) {}

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
      this._snackBar.open(
        `Le composant de conexion ne s'est pas initialiser correctement.`
      );
    }
  }

  private registerIdentityEvents() {
    this.identity.on('init', (user: any) => console.log('init', user));
    this.identity.on('login', (user: any) => console.log('login', user));
    this.identity.on('logout', () => console.log('Logged out'));
    this.identity.on('error', (err: any) => console.error('Error', err));
    this.identity.on('open', () => console.log('Widget opened'));
    this.identity.on('close', () => console.log('Widget closed'));
  }
}
