import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Meet } from '../../models/meet';
import { meetTypes } from '../../models/meet-type';
import { regions } from '../../models/region';
import { MeetService } from '../../services/meet.service';

@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeetListComponent implements OnInit, OnDestroy {
  meets?: Meet[];

  meetTypes;
  regions;
  filterGroup: FormGroup;
  filters: { [name: string]: (meet: Meet) => boolean };
  sidenavOpened;

  private _allMeets?: Meet[];
  private _subscriptions: Subscription;

  constructor(
    private meetService: MeetService,
    private changeRef: ChangeDetectorRef
  ) {
    this.meetTypes = meetTypes;
    this.regions = regions;
    this.filters = {};
    this.sidenavOpened = true;

    this.filterGroup = new FormGroup({
      title: new FormControl(''),
      offerType: new FormControl(null),
      type: new FormArray([]),
      dateStart: new FormControl(''),
      dateEnd: new FormControl(),
      region: new FormControl(null),
      user: new FormControl(),
    });
    this.meetTypes.forEach(() => {
      this.typeControl.push(new FormControl(true));
    });

    this._subscriptions = this.titleControl.valueChanges.subscribe((value) => {
      if (value) {
        this.filters['title'] = (meet: Meet) =>
          !!meet.title &&
          meet.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >=
            0;
      } else {
        delete this.filters['title'];
      }
    });
    this._subscriptions.add(
      this.offerTypeControl.valueChanges.subscribe((value) => {
        if (value) {
          this.filters['offerType'] = (meet: Meet) => meet.offerType === value;
        } else {
          delete this.filters['offerType'];
        }
      })
    );
    this._subscriptions.add(
      this.typeControl.valueChanges.subscribe((value: boolean[]) => {
        if (value) {
          const hasFalse = value.findIndex((value) => value === false);
          if (hasFalse >= 0) {
            this.filters['type'] = (meet: Meet) => {
              const findValue = value
                .map((value, index) => (value ? meetTypes[index] : ''))
                .find((meetType) => meetType === meet.type);
              return !!findValue;
            };
          } else {
            delete this.filters['type'];
          }
        } else {
          delete this.filters['type'];
        }
      })
    );
    this._subscriptions.add(
      this.dateStartControl.valueChanges.subscribe((value) => {
        if (value) {
          this.filters['dateStart'] = (meet: Meet) => {
            const startDate = new Date(meet.dateStart);
            const filterStartDate = new Date(value);
            return startDate >= filterStartDate;
          }
        } else {
          delete this.filters['dateStart'];
        }
      })
    );
    this._subscriptions.add(
      this.dateEndControl.valueChanges.subscribe((value) => {
        if (value) {
          this.filters['dateEnd'] = (meet: Meet) => {
            const endDate = new Date(meet.dateEnd);
            const filterEndDate = new Date(value);
            return endDate <= filterEndDate;
          }
        } else {
          delete this.filters['dateEnd'];
        }
      })
    );
    this._subscriptions.add(
      this.regionControl.valueChanges.subscribe((value) => {
        if (value) {
          this.filters['region'] = (meet: Meet) => meet.region === value;
        } else {
          delete this.filters['region'];
        }
      })
    );
    this._subscriptions.add(
      this.userControl.valueChanges.subscribe((value: string) => {
        if (value) {
          this.filters['user'] = (meet: Meet) =>
            meet.user.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >=
            0;
        } else {
          delete this.filters['user'];
        }
      })
    );
    this._subscriptions.add(
      this.filterGroup.valueChanges.subscribe((value) => {
        this.applyFilters();
        this.sortByDateStart();
        this.changeRef.markForCheck();
      })
    );
  }

  ngOnInit(): void {
    this.meetService.readAll().subscribe((values) => {
      this._allMeets = values;
      this.meets = values;
      this.applyFilters();
      this.sortByDateStart();
      this.changeRef.markForCheck();
    });
  }
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  applyFilters() {
    if (this._allMeets) {
      this.meets = this._allMeets;
      for (const key in this.filters) {
        if (Object.prototype.hasOwnProperty.call(this.filters, key)) {
          const filterFunction = this.filters[key];
          this.meets = this.meets.filter(filterFunction);
        }
      }
    }
  }
  sortByDateStart() {
    if (this.meets) {
      this.meets.sort((value1, value2) => {
        const date1 = new Date(value1.dateStart);
        const date2 = new Date(value2.dateStart);
        return date1 > date2 ? 1 : -1;
      });
    }
  }

  onFilterClick() {
    this.sidenavOpened = !this.sidenavOpened;
  }
  onFilterCloseCick() {
    this.sidenavOpened = false;
  }

  get titleControl() {
    return this.filterGroup.get('title') as FormControl;
  }
  get offerTypeControl() {
    return this.filterGroup.get('offerType') as FormControl;
  }
  get typeControl() {
    return this.filterGroup.get('type') as FormArray;
  }
  get dateStartControl() {
    return this.filterGroup.get('dateStart') as FormControl;
  }
  get dateEndControl() {
    return this.filterGroup.get('dateEnd') as FormControl;
  }
  get regionControl() {
    return this.filterGroup.get('region') as FormControl;
  }
  get userControl() {
    return this.filterGroup.get('user') as FormControl;
  }
}
