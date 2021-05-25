import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppDataService } from 'src/app/core/services/app-data.service';
import { UserDetailService } from 'src/app/core/services/user-detail.service';
import { UserService } from 'src/app/core/services/user.service';
import { Meet } from '../../models/meet';
import { meetTypes } from '../../models/meet-type';
import { regions } from '../../models/region';
import { MeetService } from '../../services/meet.service';

@Component({
  selector: 'app-meet-filter',
  templateUrl: './meet-filter.component.html',
  styleUrls: ['./meet-filter.component.scss'],
})
export class MeetFilterComponent implements OnInit {
  @Input() listTemplate: TemplateRef<any> | null = null;
  @Input() sidenavOpened: boolean = false;
  @Output() meetsChange = new EventEmitter<Meet[]>();
  @Output() sidenavOpenedChange = new EventEmitter<boolean>();

  meets?: Meet[];

  meetTypes;
  regions;
  filterGroup: FormGroup;
  filters: { [name: string]: (meet: Meet) => boolean };

  private _allMeets?: Meet[];
  private _subscriptions: Subscription;

  constructor(
    private meetService: MeetService,
    private userService: UserService,
    private userDetailService: UserDetailService,
    private appService: AppDataService
  ) {
    this.meetTypes = meetTypes;
    this.regions = regions;
    this.filters = {};

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
          };
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
          };
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
        this.meetsChange.emit(this.meets);
      })
    );
    this._subscriptions.add(
      this.appService.userDetail.subscribe((userDetail) => {
        if (userDetail.autosuggest) {
          this.filterGroup.patchValue(userDetail.autosuggest);
        }
      }
      )
    );
  }

  ngOnInit(): void {
    this.meetService.readAll().subscribe((values) => {
      this._allMeets = values;
      this.meets = values;
      this.applyFilters();
      this.sortByDateStart();
      this.meetsChange.emit(this.meets);
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
    this.sidenavOpenedChange.emit(false);
  }
  onFilterSave() {
    this.appService.userDetail.pipe(take(1)).subscribe((userDetail) => {
      userDetail.autosuggest = this.filterGroup.value;

      if (userDetail.id) {
        this.userDetailService.update(userDetail).subscribe(
          (response) => {
            console.log('User detail updated : ', response);
          },
          (error) => {
            console.error('User detail update error : ', error);
          }
        );
      } else if (this.userService.userName) {
        userDetail.userName = this.userService.userName;
        this.userDetailService.create(userDetail).subscribe(
          (response) => {
            console.log('User detail created : ', response);
            this.appService.userDetail.next(response);
          },
          (error) => {
            console.error('User detail creation error : ', error);
          }
        );;
      }
    });
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
