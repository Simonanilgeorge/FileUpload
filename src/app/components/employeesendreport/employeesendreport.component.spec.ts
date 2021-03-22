import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesendreportComponent } from './employeesendreport.component';

describe('EmployeesendreportComponent', () => {
  let component: EmployeesendreportComponent;
  let fixture: ComponentFixture<EmployeesendreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesendreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesendreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
