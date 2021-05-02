import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';

import { Meet } from '../../models/meet';
import { MeetService } from '../../services/meet.service';
import { dateToString, roundHour } from '../../utils/date.utils';

@Component({
  selector: 'app-meet-update',
  templateUrl: './meet-update.component.html',
  styleUrls: ['./meet-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetUpdateComponent implements OnInit {

  meetId?: string;
  meetGroup: FormGroup;
  meetTypes: string[];
  regions: { code: number, name: string}[];
  isProduction: boolean;

  constructor(
    private meetService: MeetService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.isProduction = environment.production;
    const currentDate = roundHour(new Date());
    const nextHour = new Date(currentDate);
    nextHour.setHours(currentDate.getHours() + 1);
    this.meetGroup = new FormGroup({
      title: new FormControl(''),
      offerType: new FormControl(1, Validators.required),
      type: new FormControl('Préposé', Validators.required),
      dateStart: new FormControl(dateToString(currentDate), Validators.required),
      dateEnd: new FormControl(dateToString(nextHour), Validators.required),
      region: new FormControl(16, Validators.required)
    });
    this.meetTypes = [
      'Accompagnateur',
      'Ménage',
      'Personne à tout faire',
      'Préposé',
      'Sport',
      'Transport',
    ];
    this.regions = [
      { code: 1, name: 'Bas-St-Laurent' },
      { code: 2, name: 'Saguenay-Lac-Saint-Jean' },
      { code: 3, name: 'Québec' },
      { code: 4, name: 'Mauricie' },
      { code: 5, name: 'Estrie' },
      { code: 6, name: 'Montréal' },
      { code: 7, name: 'Outaouais' },
      { code: 8, name: 'Abitibi-Témiscamingue' },
      { code: 9, name: 'Côte-Nord' },
      { code: 10, name: 'Nord-du-Quebec' },
      { code: 11, name: 'Gaspésie-Îles-de-la-Madeleine' },
      { code: 12, name: 'Chaudière-Appalaches' },
      { code: 13, name: 'Laval' },
      { code: 14, name: 'Lanaudière' },
      { code: 15, name: 'Laurentides' },
      { code: 16, name: 'Montérégie' }, 
      { code: 17, name: 'Centre-du-Québec' },
    ];
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.meetGroup.valid) {
      const meet: Meet = this.meetGroup.value;
      meet.user = this.userService.currentUser;

      const updateMethod = this.meetId ? this.meetService.create : this.meetService.update;
      updateMethod(meet).subscribe(response => {
        console.log('Saved Meet : ', response);
        this.alertService.showSuccess('La rencontre a été enregistré avec succès.');
      }, error => {
        console.error(error);
        this.alertService.showError(`Un problème s'est produit lors de l'enregistrement.`);
      });
    }
  }

  get titleControl() { return this.meetGroup.get('title') as FormControl; }
  get offerTypeControl() { return this.meetGroup.get('offerType') as FormControl; }
  get typeControl() { return this.meetGroup.get('type') as FormControl; }
  get dateStartControl() { return this.meetGroup.get('dateStart') as FormControl; }
  get dateEndControl() { return this.meetGroup.get('dateEnd') as FormControl; }
  get regionControl() { return this.meetGroup.get('region') as FormControl; }
}
