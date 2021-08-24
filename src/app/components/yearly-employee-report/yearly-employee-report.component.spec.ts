import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyEmployeeReportComponent } from './yearly-employee-report.component';

describe('YearlyEmployeeReportComponent', () => {
  let component: YearlyEmployeeReportComponent;
  let fixture: ComponentFixture<YearlyEmployeeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyEmployeeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyEmployeeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
