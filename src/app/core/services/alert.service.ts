import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) { }

  showInfo(message: string) {
    this.snackBar.open(message);
  }

  showError(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: 'error',
      duration: 0
    });
  }

  showSuccess(message: string) {
    this.snackBar.open(message, 'OK', {
      panelClass: 'success',
      duration: 2000
    });
  }
}
