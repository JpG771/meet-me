import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';

import { Meet } from '../../models/meet';
import { regions } from '../../models/region';
import { MeetService } from '../../services/meet.service';
import { dateToString, roundHour } from '../../utils/date.utils';

@Component({
  selector: 'app-meet-update',
  templateUrl: './meet-update.component.html',
  styleUrls: ['./meet-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetUpdateComponent implements OnInit {
  meetId?: string;
  meetGroup: FormGroup;
  meetTypes: string[];
  regions: { code: number; name: string }[];
  isProduction: boolean;

  constructor(
    private meetService: MeetService,
    private userService: UserService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.isProduction = environment.production;
    const currentDate = roundHour(new Date());
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
    this.meetTypes = [
      'Accompagnateur',
      'Ménage',
      'Personne à tout faire',
      'Préposé',
      'Sport',
      'Transport',
    ];
    this.regions = regions;
    this.activatedRoute.params.subscribe((values) => {
      console.log('Update meet id ', values);
      this.meetId = values.id;
      if (this.meetId) {
        this.meetService
          .read(this.meetId)
          .subscribe((meet) => this.meetGroup.setValue(meet));
      }
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.meetGroup.valid) {
      const meet: Meet = this.meetGroup.value;
      meet.user = this.userService.userName;

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
          this.router.navigate(['.'], { relativeTo: this.activatedRoute.parent });
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
