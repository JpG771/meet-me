import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetUpdateComponent } from './meet-update.component';

describe('MeetUpdateComponent', () => {
  let component: MeetUpdateComponent;
  let fixture: ComponentFixture<MeetUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
