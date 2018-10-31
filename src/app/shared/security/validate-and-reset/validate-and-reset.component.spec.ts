import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAndResetComponent } from './validate-and-reset.component';

describe('ValidateAndResetComponent', () => {
  let component: ValidateAndResetComponent;
  let fixture: ComponentFixture<ValidateAndResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateAndResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAndResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
