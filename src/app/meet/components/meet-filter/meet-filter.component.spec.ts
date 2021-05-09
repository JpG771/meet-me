import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetFilterComponent } from './meet-filter.component';

describe('MeetFilterComponent', () => {
  let component: MeetFilterComponent;
  let fixture: ComponentFixture<MeetFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
