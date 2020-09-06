import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRegistrationComponent } from './device-registration.component';

describe('DeviceRegistrationComponent', () => {
  let component: DeviceRegistrationComponent;
  let fixture: ComponentFixture<DeviceRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
