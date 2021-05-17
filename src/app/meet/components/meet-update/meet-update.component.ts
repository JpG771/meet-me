import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';

import { Meet } from '../../models/meet';
import { meetTypes } from '../../models/meet-type';
import { regions } from '../../models/region';
import { MeetService } from '../../services/meet.service';
import { dateToString, roundHour } from '../../utils/date.utils';

@Component({
  selector: 'app-meet-update',
  templateUrl: './meet-update.component.html',
  styleUrls: ['./meet-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetUpdateComponent implements OnInit, OnDestroy {
  meetId?: string;
  meetGroup: FormGroup;
  meetTypes = meetTypes;
  regions = regions;
  isProduction: boolean;
  from?: string;
  view?: string;

  private _subscriptions: Subscription;

  constructor(
    private meetService: MeetService,
    private userService: UserService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.isProduction = environment.production;
    const currentDate = roundHour(new Date());
    currentDate.setHours(currentDate.getHours(), 0, 0, 0);
    const nextHour = new Date(currentDate);
    nextHour.setHours(currentDate.getHours() + 1);
    this.meetGroup = new FormGroup({
      title: new FormControl(''),
      offerType: new FormControl(1, Validators.required),
      type: new FormControl('Préposé', Validators.required),
      dateStart: new FormControl(
        dateToString(currentDate),
        Validators.required
      ),
      dateEnd: new FormControl(dateToString(nextHour), Validators.required),
      region: new FormControl(16, Validators.required),

      user: new FormControl(),
      id: new FormControl(),
    });
    this._subscriptions = this.activatedRoute.params.subscribe((values) => {
      console.log('Update meet id ', values);
      this.meetId = values.id;
      if (this.meetId) {
        this.meetService
          .read(this.meetId)
          .subscribe((meet) => this.meetGroup.setValue(meet));
      }
    });
    this._subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params.date) {
          const dateQuery: string = params.date;
          const year = parseInt(dateQuery.substring(0, 4), 10);
          const month = parseInt(dateQuery.substring(5, 7), 10);
          const day = parseInt(dateQuery.substring(8, 10), 10);
          const currentHours = new Date().getHours();
          const newDateStart = new Date(
            year,
            month,
            day,
            currentHours + 2,
            0,
            0,
            0
          );
          const newDateEnd = new Date(newDateStart);
          newDateEnd.setHours(currentHours + 3);
          this.dateStartControl.setValue(dateToString(newDateStart));
          this.dateEndControl.setValue(dateToString(newDateEnd));
        }
        if (params.from) {
          this.from = params.from;
        }
        if (params.dateStart) {
          this.dateStartControl.setValue(params.dateStart);
        }
        if (params.dateEnd) {
          this.dateEndControl.setValue(params.dateEnd);
        }
        if (params.view) {
          this.view = params.view;
        }
      })
    );
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  onSubmit() {
    if (this.meetGroup.valid) {
      const meet: Meet = this.meetGroup.value;
      meet.user = this.userService.userName!;

      const updateMethod = this.meetId
        ? this.meetService.update(meet)
        : this.meetService.create(meet);
      updateMethod.subscribe(
        (response) => {
          console.log('Saved Meet : ', response);
          if (response.id) {
            this.meetId = response.id;
          }
          this.alertService.showSuccess(
            'La rencontre a été enregistré avec succès.'
          );
        },
        (error) => {
          console.error(error);
          this.alertService.showError(
            `Un problème s'est produit lors de l'enregistrement.`
          );
        }
      );
    }
  }
  onDelete() {
    if (this.meetId) {
      this.meetService.delete(this.meetId).subscribe(
        (response) => {
          console.log('Meet Deleted: ', response);
          this.alertService.showSuccess(
            'La rencontre a été supprimé avec succès.'
          );
          if (this.from) {
            this.router.navigate([this.from], { queryParams: { view: this.view }});
          } else {
            this.router.navigate(['.'], {
              relativeTo: this.activatedRoute.parent,
            });
          }
        },
        (error) => {
          console.error(error);
          this.alertService.showError(
            `Un problème s'est produit lors de la suppression.`
          );
        }
      );
    }
  }

  get titleControl() {
    return this.meetGroup.get('title') as FormControl;
  }
  get offerTypeControl() {
    return this.meetGroup.get('offerType') as FormControl;
  }
  get typeControl() {
    return this.meetGroup.get('type') as FormControl;
  }
  get dateStartControl() {
    return this.meetGroup.get('dateStart') as FormControl;
  }
  get dateEndControl() {
    return this.meetGroup.get('dateEnd') as FormControl;
  }
  get regionControl() {
    return this.meetGroup.get('region') as FormControl;
  }
}
