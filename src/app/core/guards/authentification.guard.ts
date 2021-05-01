import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Route,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationGuard
  implements OnInit, CanActivate, CanActivateChild {
  private identity: any;

  ngOnInit(): void {
    this.identity = (window as any).netlifyIdentity;
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn();
  }
  canActivateChild(
    _childRoute: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.isLoggedIn();
  }
  canLoad(_route: Route) {
    return this.isLoggedIn();
  }

  private isLoggedIn(): boolean {
    return (
      this.identity && this.identity.currentUser && this.identity.currentUser()
    );
  }
}
